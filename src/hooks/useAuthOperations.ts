import { supabase } from "@/integrations/supabase/client";
import { ProfileType, User } from "@/types/auth";
import React from "react";

export const useAuthOperations = ({
  setCurrentUser,
  setProfileType,
  setIsAuthenticated,
  setIsLoading,
  toast
}: {
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setProfileType: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
}) => {
  const register = async (data: any) => {
    try {
      const { email, password, profileType, personType, fullName, companyName, phone, documentNumber, responsibleName, responsibleCpf, address } = data;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            profileType,
            personType,
            fullName,
            companyName,
            phone,
            documentNumber,
            responsibleName,
            responsibleCpf,
            address,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          email,
          profile_type: profileType,
          person_type: personType,
          full_name: fullName,
          company_name: companyName,
          phone,
          document_number: documentNumber,
          responsible_name: responsibleName,
          responsible_cpf: responsibleCpf,
          cep: address.cep,
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        },
      ]);

      if (profileError) {
        throw profileError;
      }

      return authData;
    } catch (error: any) {
      console.error("🚀 ~ file: useAuthOperations.ts:48 ~ register ~ error:", error)
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com segurança.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde.",
      });
    }
  };

  const login = async (email: string, password: string, profileType: ProfileType) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if account is soft-deleted
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('deleted')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // If account is soft-deleted, block access and logout
      if (profile?.deleted === true) {
        await supabase.auth.signOut();
        throw new Error("Conta desativada. Entre em contato com o suporte para reativação.");
      }
      
      // Verify profile type matches requested type
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('profile_type')
        .eq('id', data.user.id)
        .single();
        
      if (userProfileError) {
        throw userProfileError;
      }
      
      if (userProfile.profile_type !== profileType) {
        await supabase.auth.signOut();
        throw new Error(`Acesso negado. Essa conta não é do tipo ${profileType}.`);
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    login,
    logout,
    register
  };
};

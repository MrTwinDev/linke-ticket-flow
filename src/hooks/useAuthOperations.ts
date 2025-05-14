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
      
      // Sign up the user
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

      if (!authData.user?.id) {
        throw new Error("Failed to create user account");
      }

      console.log("🟢 User registered successfully:", authData.user.id);

      // Create profile entry (this might be handled automatically by a trigger)
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
        console.error("🔴 Error creating profile:", profileError);
        throw profileError;
      }

      console.log("✅ Profile created successfully");
      return authData;
    } catch (error: any) {
      console.error("🚀 ~ file: useAuthOperations.ts ~ register ~ error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("[auth] Logging out user");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Update state
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com segurança.",
      });
      
      // Don't return the boolean value
    } catch (error: any) {
      console.error('[auth] Logout error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde.",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string, profileType: ProfileType) => {
    try {
      console.log(`[auth] Logging in as ${email} with profile type ${profileType}`);
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[auth] Login error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('[auth] No user returned from login');
        throw new Error("Falha na autenticação. Usuário não encontrado.");
      }

      console.log('[auth] Login successful, checking profile');

      // Check if account is soft-deleted
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('deleted, profile_type')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('[auth] Error fetching profile:', profileError);
        // Don't throw here - just log and proceed
      }
      
      // If we have profile data and it's marked as deleted, block access
      if (profile?.deleted === true) {
        console.warn('[auth] Attempting to access deleted account');
        await supabase.auth.signOut();
        throw new Error("Conta desativada. Entre em contato com o suporte para reativação.");
      }
      
      // Only block if profile type is explicitly different and we have confirmed the profile type
      if (profile && profile.profile_type && profile.profile_type !== profileType) {
        console.warn(`[auth] Profile type mismatch: Expected ${profileType}, got ${profile.profile_type}`);
        await supabase.auth.signOut();
        throw new Error(`Acesso negado. Essa conta não é do tipo ${profileType}.`);
      }
      
      console.log('[auth] Profile checks passed, returning session data');
      
      // Return session data for further processing
      return data;
    } catch (error: any) {
      console.error('[auth] Login process failed:', error);
      throw error;
    }
  };

  return {
    login,
    logout,
    register
  };
};

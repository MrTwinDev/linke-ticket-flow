import { supabase } from "@/integrations/supabase/client";
import { ProfileType, User } from "@/types/auth";
import React from "react";

export const useAuthOperations = ({
  setCurrentUser,
  setProfileType,
  setIsAuthenticated,
  setIsLoading,
  toast,
}: {
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setProfileType: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
}) => {
  const register = async (data: any) => {
    try {
      const {
        email,
        password,
        profileType,
        personType,
        fullName,
        companyName,
        phone,
        documentNumber,
        responsibleName,
        responsibleCpf,
        address,
      } = data;

      // 1. Cria o usuário
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

      if (authError) throw authError;
      if (!authData.user?.id) throw new Error("Falha ao criar conta.");

      // 2. Login imediato para garantir sessão
      await supabase.auth.signInWithPassword({ email, password });

      // 3. Cria o perfil
      const { error: profileError } = await supabase.from("profiles").insert([
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
        console.error("🔴 Erro ao inserir perfil:", profileError);
        throw profileError;
      }

      return authData;
    } catch (error: any) {
      console.error("🔴 Erro no registro:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
      toast({
        title: "Logout realizado",
        description: "Você saiu com segurança.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message || "Tente novamente mais tarde.",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string, profileType: ProfileType) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error("Credenciais inválidas.");

      if (!data?.user?.id) throw new Error("Usuário não encontrado.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("deleted, profile_type")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) console.warn("⚠️ Falha ao buscar perfil:", profileError);

      if (profile?.deleted === true) {
        await supabase.auth.signOut();
        throw new Error("Conta desativada. Contate o suporte.");
      }

      if (profile?.profile_type && profile.profile_type !== profileType) {
        await supabase.auth.signOut();
        throw new Error(`Acesso negado: esta conta não é do tipo ${profileType}.`);
      }

      return data;
    } catch (error: any) {
      console.error("[auth] Falha no login:", error);
      throw error;
    }
  };

  return {
    login,
    logout,
    register,
  };
};

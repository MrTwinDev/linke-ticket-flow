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
      
      // Make sure we are explicitly awaiting the result here
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Handle login errors immediately
      if (error) {
        console.error('[auth] Login error:', error);
        throw error;
      }

      // Verify we have a valid user
      if (!data || !data.user) {
        console.error('[auth] No user returned from login');
        throw new Error("Falha na autenticação. Usuário não encontrado.");
      }

      console.log('[auth] Login successful, checking profile');

      try {
        // Check profile - use a timeout to avoid potential auth state race conditions
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('deleted, profile_type')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('[auth] Error fetching profile:', profileError);
          // Log but don't throw here to avoid blocking login
        }
        
        // If account is deleted, block login
        if (profile?.deleted === true) {
          console.warn('[auth] Attempting to access deleted account');
          await supabase.auth.signOut();
          throw new Error("Conta desativada. Entre em contato com o suporte para reativação.");
        }
        
        // Check profile type if we got valid profile data (but don't block if profile is missing)
        if (profile?.profile_type && profile.profile_type !== profileType) {
          console.warn(`[auth] Profile type mismatch: Expected ${profileType}, got ${profile.profile_type}`);
          await supabase.auth.signOut();
          throw new Error(`Acesso negado. Essa conta não é do tipo ${profileType}.`);
        }

        // Even if profile check has issues, we should still allow login
        console.log('[auth] Login and profile checks completed successfully');
        
        // Return session data for further processing
        return data;
      } catch (profileErr: any) {
        // Only rethrow specific errors from profile validation
        if (profileErr instanceof Error && 
            (profileErr.message.includes("Conta desativada") || 
             profileErr.message.includes("Acesso negado"))) {
          throw profileErr;
        }
        
        // For other profile-related errors, log but still return auth data
        console.warn('[auth] Profile validation warning:', profileErr);
        return data;
      }
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


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegisterData, ProfileType, User, PersonType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

// Define the toast type locally since it's not exported from use-toast
type ToastFunction = ReturnType<typeof useToast>["toast"];

interface UseAuthOperationsProps {
  setCurrentUser: (user: User | null) => void;
  setProfileType: (profileType: ProfileType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  toast: ToastFunction;
}

export const useAuthOperations = ({
  setCurrentUser,
  setProfileType,
  setIsAuthenticated,
  setIsLoading,
  toast
}: UseAuthOperationsProps) => {
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(`🟢 Attempting login for ${email}`);
      
      // Using signInWithPassword with option object format for better error handling
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("🔴 Login error details:", error);
        throw error;
      }
      
      // Log successful authentication
      console.log("✅ Authentication successful:", data);
      
      // Fetch user profile
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error("🔴 Profile fetch error:", profileError);
          throw new Error("Failed to fetch user profile");
        }
        
        console.log("✅ Retrieved profile data:", profileData);
        
        // Set user state based on profile
        if (profileData) {
          const userProfileType = profileData.profile_type as ProfileType;
          
          console.log("✅ Setting profile type:", userProfileType);
          
          const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            profileType: userProfileType,
            personType: profileData.person_type as PersonType,
            phone: profileData.phone || '',
            documentNumber: profileData.document_number || '',
            address: {
              cep: profileData.cep || '',
              street: profileData.street || '',
              number: profileData.number || '',
              complement: profileData.complement || undefined,
              neighborhood: profileData.neighborhood || '',
              city: profileData.city || '',
              state: profileData.state || '',
            },
          };

          // Set additional fields based on person type
          if (profileData.person_type === 'PF') {
            user.fullName = profileData.full_name || undefined;
          } else if (profileData.person_type === 'PJ') {
            user.companyName = profileData.company_name || undefined;
            user.responsibleName = profileData.responsible_name || undefined;
            user.responsibleCpf = profileData.responsible_cpf || undefined;
          }

          console.log("✅ Built user object:", user);
          
          setCurrentUser(user);
          setProfileType(userProfileType);
          setIsAuthenticated(true);
          
          console.log("✅ Auth state updated with profile type:", userProfileType);
        }
      }
      
      return data;
    } catch (err) {
      console.error("🔴 Login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("🔴 Logout error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      console.log("🟢 Starting registration for:", data.email);
      
      // Directly use the Supabase client for signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (signUpError) {
        console.error("🔴 Signup error:", signUpError);
        throw signUpError;
      }
      
      if (!signUpData.user) {
        throw new Error("No user returned from signup");
      }
      
      console.log("✅ User signed up successfully:", signUpData.user.id);
      
      // Create profile entry
      const profileData = {
        id: signUpData.user.id,
        profile_type: data.profileType,
        person_type: data.personType,
        phone: data.phone,
        document_number: data.documentNumber,
        cep: data.address.cep,
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement || null,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
      };
      
      // Add person-specific fields
      if (data.personType === 'PF') {
        Object.assign(profileData, {
          full_name: data.fullName,
        });
      } else {
        Object.assign(profileData, {
          company_name: data.companyName,
          responsible_name: data.responsibleName,
          responsible_cpf: data.responsibleCpf,
        });
      }
      
      console.log("🟢 Creating profile for user:", profileData);
      
      // Update or create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);
        
      if (profileError) {
        console.error("🔴 Profile creation error:", profileError);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }
      
      console.log("✅ Profile created successfully");
      
      // Auto login after signup
      if (data.autoLogin !== false) {
        console.log("🟢 Attempting auto-login after registration");
        try {
          const loginResult = await login(data.email, data.password);
          console.log("✅ Auto-login successful after registration");
          return loginResult;
        } catch (loginErr) {
          console.error("🟠 Auto-login failed after registration:", loginErr);
          // Don't throw here, registration was still successful
          toast({
            title: "Registro concluído",
            description: "Conta criada com sucesso, mas o login automático falhou. Por favor, faça login manualmente.",
            variant: "default"
          });
        }
      } else {
        console.log("ℹ️ Auto-login skipped as requested");
        toast({
          title: "Registro bem-sucedido",
          description: "Sua conta foi criada com sucesso. Verifique seu email para confirmar o cadastro.",
        });
      }
      
      return signUpData;
    } catch (err: any) {
      console.error('🔴 Registration error:', err);
      
      // Provide more specific error messages
      let errorMessage = err.message || "Ocorreu um erro durante o registro.";
      
      if (err.message === "Failed to fetch") {
        errorMessage = "Erro de conexão com o servidor. Verifique sua conexão à internet e tente novamente.";
      } else if (err.message?.includes("unique constraint")) {
        errorMessage = "Este email já está cadastrado. Por favor, utilize outro email ou faça login.";
      }
      
      toast({
        variant: "destructive",
        title: "Falha no registro",
        description: errorMessage,
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    register
  };
};

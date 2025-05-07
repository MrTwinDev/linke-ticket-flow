
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
  
  const login = async (email: string, password: string, profileType: ProfileType) => {
    setIsLoading(true);
    console.log(`🟢 Attempting login as ${profileType} for ${email}`);
    
    try {
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
        
        // Set user state based on profile
        if (profileData) {
          setCurrentUser({
            id: data.user.id,
            email: data.user.email || '',
            profileType: profileData.profile_type as ProfileType,
            personType: profileData.person_type as PersonType,
            phone: profileData.phone,
            documentNumber: profileData.document_number,
            address: {
              cep: profileData.cep,
              street: profileData.street,
              number: profileData.number,
              complement: profileData.complement || undefined,
              neighborhood: profileData.neighborhood,
              city: profileData.city,
              state: profileData.state,
            },
            ...(profileData.person_type === 'PF'
              ? { fullName: profileData.full_name }
              : {
                  companyName: profileData.company_name,
                  responsibleName: profileData.responsible_name,
                  responsibleCpf: profileData.responsible_cpf,
                }),
          });
          setProfileType(profileData.profile_type as ProfileType);
          setIsAuthenticated(true);
          
          console.log("✅ User session established with profile type:", profileData.profile_type);
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
      console.log("🟢 Attempting logout");
      await supabase.auth.signOut();
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
      console.log("✅ Logout successful");
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
      console.log("🟢 Attempting registration for:", data.email);
      
      // Get the API key directly from the supabase client
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNTQyNDMsImV4cCI6MjAyMDczMDg0M30.8Vvj3Aelw5vEjD4OcqPP92Vp6Lhd3RB-Dz0qpwR5O8A';
      
      // Call the edge function to handle registration
      const response = await fetch('https://qainlosbrisovatxvxxx.supabase.co/functions/v1/autoconfirm-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          profileType: data.profileType,
          personType: data.personType,
          phone: data.phone,
          documentNumber: data.documentNumber,
          address: data.address,
          fullName: data.fullName,
          companyName: data.companyName,
          responsibleName: data.responsibleName,
          responsibleCpf: data.responsibleCpf
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🔴 Registration error from edge function:", errorData);
        throw new Error(errorData.message || 'Erro no registro.');
      }

      const result = await response.json();
      console.log("✅ Registration successful:", result);

      // Automatically log in the user after successful registration
      console.log("🟢 Attempting auto-login after registration");
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInErr) {
        console.error('🔴 Auto-login error:', signInErr);
        throw new Error(`Cadastro realizado, mas o login falhou: ${signInErr.message}`);
      }

      console.log("✅ Auto-login successful:", !!signInData.user);
      
      if (signInData.user) {
        setIsAuthenticated(true);
        setCurrentUser({
          id: signInData.user.id,
          email: signInData.user.email || '',
          profileType: data.profileType,
          personType: data.personType,
          phone: data.phone,
          documentNumber: data.documentNumber,
          address: data.address,
          ...(data.personType === 'PF'
            ? { fullName: data.fullName }
            : {
                companyName: data.companyName,
                responsibleName: data.responsibleName,
                responsibleCpf: data.responsibleCpf,
              }),
        });
        setProfileType(data.profileType);
        
        console.log("✅ User session established after registration");
      }

      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso e você foi autenticado.",
      });

      return signInData;
    } catch (err: any) {
      console.error('🔴 Registration error:', err);
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

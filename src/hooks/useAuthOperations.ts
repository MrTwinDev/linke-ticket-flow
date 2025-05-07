
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegisterData, ProfileType, User, PersonType } from "@/types/auth";
import { UseToastReturn } from "@/hooks/use-toast";

interface UseAuthOperationsProps {
  setCurrentUser: (user: User | null) => void;
  setProfileType: (profileType: ProfileType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  toast: UseToastReturn["toast"];
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
    try {
      console.log(`🟢 Attempting login as ${profileType} for ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
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
      const response = await fetch('https://qainlosbrisovatxvxxx.supabase.co/functions/v1/autoconfirm-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs',
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
        const error = await response.json();
        throw new Error(error.message || 'Erro no registro.');
      }

      const result = await response.json();

      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInErr) {
        console.error('Erro no login automático:', signInErr);
        throw new Error(`Cadastro realizado, mas o login falhou: ${signInErr.message}`);
      }

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
      }

      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso e você foi autenticado.",
      });

      return signInData;
    } catch (err: any) {
      console.error('Registration error:', err);
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

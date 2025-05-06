
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define user types
export type ProfileType = "importer" | "broker";
export type PersonType = "PF" | "PJ";

export interface User {
  id: string;
  email: string;
  profileType: ProfileType;
  personType: PersonType;
  fullName?: string;
  companyName?: string;
  phone: string;
  documentNumber: string;
  responsibleName?: string;
  responsibleCpf?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  profileType: ProfileType;
  personType: PersonType;
  fullName?: string;
  companyName?: string;
  phone: string;
  documentNumber: string;
  responsibleName?: string;
  responsibleCpf?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface AuthContextType {
  currentUser: User | null;
  profileType: ProfileType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, profileType: ProfileType) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true);
        if (session?.user) {
          try {
            // Fetch profile from DB
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (error) throw error;
            if (profile) {
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                profileType: profile.profile_type as ProfileType,
                personType: profile.person_type as PersonType,
                phone: profile.phone,
                documentNumber: profile.document_number,
                address: {
                  cep: profile.cep,
                  street: profile.street,
                  number: profile.number,
                  complement: profile.complement,
                  neighborhood: profile.neighborhood,
                  city: profile.city,
                  state: profile.state,
                }
              };
              if (profile.person_type === 'PF') {
                user.fullName = profile.full_name;
              } else {
                user.companyName = profile.company_name;
                user.responsibleName = profile.responsible_name;
                user.responsibleCpf = profile.responsible_cpf;
              }
              setCurrentUser(user);
              setProfileType(profile.profile_type as ProfileType);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setCurrentUser(null);
            setProfileType(null);
            setIsAuthenticated(false);
          }
        } else {
          setCurrentUser(null);
          setProfileType(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login method
  const login = async (
    email: string,
    password: string,
    requestedProfile: ProfileType
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        const { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('profile_type')
          .eq('id', data.user.id)
          .single();
        if (profError) throw profError;
        if (prof.profile_type !== requestedProfile) {
          await supabase.auth.signOut();
          // Clear local state immediately
          setCurrentUser(null);
          setProfileType(null);
          setIsAuthenticated(false);
          throw new Error(
            `You do not have an ${requestedProfile} account associated with this email.`
          );
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      // Clear local auth state immediately
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Falha ao sair',
        description: 'Ocorreu um erro durante o logout.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register method
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (signUpError) throw signUpError;
      const user = signUpData.user;
      if (!user) throw new Error('Falha ao criar usuário');

      const updates: Record<string, any> = {
        profile_type:    userData.profileType,
        person_type:     userData.personType,
        phone:           userData.phone,
        document_number: userData.documentNumber,
        cep:             userData.address.cep,
        street:          userData.address.street,
        number:          userData.address.number,
        complement:      userData.address.complement || null,
        neighborhood:    userData.address.neighborhood,
        city:            userData.address.city,
        state:           userData.address.state,
      };
      if (userData.personType === 'PF') {
        updates.full_name = userData.fullName;
      } else {
        updates.company_name     = userData.companyName;
        updates.responsible_name = userData.responsibleName;
        updates.responsible_cpf  = userData.responsibleCpf;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (updateError) throw updateError;
    } catch (error: any) {
      console.error('Registration error:', error);
      await supabase.auth.signOut();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    profileType,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

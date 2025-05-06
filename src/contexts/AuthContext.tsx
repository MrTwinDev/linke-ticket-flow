
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos de perfil e pessoa
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

export interface RegisterData {
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
  login: (email: string, password: string, profile: ProfileType) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Escuta mudanças de sessão
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true);
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (error) throw error;

            // Constrói objeto User
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
                complement: profile.complement || undefined,
                neighborhood: profile.neighborhood,
                city: profile.city,
                state: profile.state,
              },
            };
            if (profile.person_type === 'PF') {
              user.fullName = profile.full_name || undefined;
            } else {
              user.companyName = profile.company_name || undefined;
              user.responsibleName = profile.responsible_name || undefined;
              user.responsibleCpf = profile.responsible_cpf || undefined;
            }

            setCurrentUser(user);
            setProfileType(profile.profile_type as ProfileType);
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Erro ao buscar perfil:', err);
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

    // Verificação inicial de sessão
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Faz login
  const login = async (
    email: string,
    password: string,
    requestedProfile: ProfileType
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const { data: prof, error: profErr } = await supabase
          .from('profiles')
          .select('profile_type')
          .eq('id', data.user.id)
          .single();
        if (profErr) throw profErr;
        if (prof.profile_type !== requestedProfile) {
          await supabase.auth.signOut();
          throw new Error(`Você não possui um perfil ${requestedProfile} para este e-mail.`);
        }
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Faz logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Erro no logout:', err);
      toast({
        variant: 'destructive',
        title: 'Falha ao sair',
        description: 'Não foi possível encerrar a sessão.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Faz cadastro
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email: data.email, password: data.password });
      if (signUpErr) throw signUpErr;
      const user = signUpData.user;
      if (!user) throw new Error('Falha ao criar usuário.');

      // Atualiza perfil (trigger já inseriu linha)
      const updates: any = {
        profile_type:    data.profileType,
        person_type:     data.personType,
        phone:           data.phone,
        document_number: data.documentNumber,
        cep:             data.address.cep,
        street:          data.address.street,
        number:          data.address.number,
        complement:      data.address.complement || null,
        neighborhood:    data.address.neighborhood,
        city:            data.address.city,
        state:           data.address.state,
      };
      if (data.personType === 'PF') {
        updates.full_name = data.fullName;
      } else {
        updates.company_name     = data.companyName;
        updates.responsible_name = data.responsibleName;
        updates.responsible_cpf  = data.responsibleCpf;
      }
      const { error: updErr } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (updErr) throw updErr;
      
      // Automatically sign in the user after successful registration
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (signInErr) {
        // If sign-in fails, sign out and report the error
        await supabase.auth.signOut();
        throw new Error(`Registro concluído, mas falha ao fazer login: ${signInErr.message}`);
      }
      
      // Note: No need to manually update state here, as the onAuthStateChange listener
      // will automatically update the state when the user is signed in
      
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso e você foi autenticado.",
      });
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      await supabase.auth.signOut();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      profileType,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export types for convenience
export type { User as AuthUser, RegisterData };

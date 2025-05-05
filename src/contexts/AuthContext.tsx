
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on component mount
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (session && session.user) {
          try {
            // Fetch user profile from our profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;

            if (profile) {
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                profileType: profile.profile_type as ProfileType,
                personType: profile.person_type as PersonType,
                phone: profile.phone || '',
                documentNumber: profile.document_number || '',
                address: {
                  cep: profile.cep || '',
                  street: profile.street || '',
                  number: profile.number || '',
                  complement: profile.complement || '',
                  neighborhood: profile.neighborhood || '',
                  city: profile.city || '',
                  state: profile.state || '',
                }
              };

              // Add conditional fields based on person type
              if (profile.person_type === 'PF') {
                userData.fullName = profile.full_name;
              } else {
                userData.companyName = profile.company_name;
                userData.responsibleName = profile.responsible_name;
                userData.responsibleCpf = profile.responsible_cpf;
              }

              setCurrentUser(userData);
              setProfileType(profile.profile_type as ProfileType);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle login
  const login = async (email: string, password: string, profile: ProfileType) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has the correct profile type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('profile_type')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.profile_type !== profile) {
          // If profile types don't match, log them out and throw an error
          await supabase.auth.signOut();
          throw new Error(`You do not have an ${profile} account associated with this email.`);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Falha ao sair",
        description: "Ocorreu um erro durante o logout.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error("Falha ao criar usuário");
      }

      // Now create or update the profile
      const profileData: any = {
        id: data.user.id,
        profile_type: userData.profileType,
        person_type: userData.personType,
        phone: userData.phone,
        document_number: userData.documentNumber,
        // Address fields
        cep: userData.address.cep,
        street: userData.address.street,
        number: userData.address.number,
        complement: userData.address.complement || null,
        neighborhood: userData.address.neighborhood,
        city: userData.address.city,
        state: userData.address.state
      };

      // Add person type specific fields
      if (userData.personType === 'PF') {
        profileData.full_name = userData.fullName;
      } else {
        profileData.company_name = userData.companyName;
        profileData.responsible_name = userData.responsibleName;
        profileData.responsible_cpf = userData.responsibleCpf;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        // If profile creation fails, try to clean up the auth user
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      // Try to sign out in case of error to clean up state
      await supabase.auth.signOut();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
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

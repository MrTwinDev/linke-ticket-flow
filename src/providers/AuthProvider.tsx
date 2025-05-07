
// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  ProfileType, 
  PersonType, 
  RegisterData, 
  AuthContextType 
} from "@/types/auth";
import { useAuthOperations } from "@/hooks/useAuthOperations";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { login, logout, register } = useAuthOperations({
    setCurrentUser,
    setProfileType,
    setIsAuthenticated,
    setIsLoading,
    toast
  });

  // Auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true);
        console.log("Auth state changed:", _event, !!session);
        
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (error) throw error;

            console.log("Profile loaded during auth state change:", profile);

            if (!profile) {
              console.error("No profile found for user", session.user.id);
              setCurrentUser(null);
              setProfileType(null);
              setIsAuthenticated(false);
              setIsLoading(false);
              return;
            }

            // Build User object
            const user: User = {
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
                complement: profile.complement || undefined,
                neighborhood: profile.neighborhood || '',
                city: profile.city || '',
                state: profile.state || '',
              },
            };
            
            // Set person-type specific fields
            if (profile.person_type === 'PF') {
              user.fullName = profile.full_name || undefined;
            } else {
              user.companyName = profile.company_name || undefined;
              user.responsibleName = profile.responsible_name || undefined;
              user.responsibleCpf = profile.responsible_cpf || undefined;
            }

            console.log("User profile loaded", { 
              profileType: profile.profile_type, 
              email: session.user.email
            });
            
            setCurrentUser(user);
            setProfileType(profile.profile_type as ProfileType);
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Error fetching profile:', err);
            setCurrentUser(null);
            setProfileType(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log("No active session");
          setCurrentUser(null);
          setProfileType(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    console.log("Checking for existing session");
    supabase.auth.getSession().then(({ data }) => {
      console.log("Initial session check:", !!data.session);
      if (!data.session) setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

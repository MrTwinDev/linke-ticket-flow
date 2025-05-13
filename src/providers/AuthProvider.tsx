
// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
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
    console.log("🔄 Setting up auth state listener");
    
    // Clean up any existing auth state that might be invalid
    // cleanupAuthState(); - Removing this to prevent wiping out valid sessions
    
    let hasInitialSessionChecked = false;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, !!session);
        setIsLoading(true);
        
        if (session?.user) {
          try {
            // Use setTimeout to prevent potential deadlock with Supabase client
            setTimeout(async () => {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (error) {
                console.error('🔴 Error fetching profile:', error);
                setCurrentUser(null);
                setProfileType(null);
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
              }

              // If no profile found, possibly a new registration
              if (!profile) {
                console.warn('🟠 No profile found for user:', session.user.id);
                // For new registrations, we might need to wait for profile creation
                // We'll set authenticated based on session presence
                setIsAuthenticated(!!session);
                setIsLoading(false);
                return;
              }

              // Skip if profile is deleted
              if (profile.deleted === true) {
                console.warn('🔴 Account is deleted:', session.user.id);
                await supabase.auth.signOut();
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
              
              if (profile.person_type === 'PF') {
                user.fullName = profile.full_name || undefined;
              } else {
                user.companyName = profile.company_name || undefined;
                user.responsibleName = profile.responsible_name || undefined;
                user.responsibleCpf = profile.responsible_cpf || undefined;
              }

              console.log("✅ User profile loaded", { profileType: profile.profile_type });
              setCurrentUser(user);
              setProfileType(profile.profile_type as ProfileType);
              setIsAuthenticated(true);
              setIsLoading(false);
            }, 0);
          } catch (err) {
            console.error('🔴 Error in auth state change handler:', err);
            setCurrentUser(null);
            setProfileType(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        } else {
          console.log("ℹ️ No active session");
          setCurrentUser(null);
          setProfileType(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    console.log("🔄 Checking for existing session");
    supabase.auth.getSession().then(({ data }) => {
      console.log("ℹ️ Initial session check:", !!data.session);
      if (!data.session) {
        setIsLoading(false);
      }
      hasInitialSessionChecked = true;
    });

    // Set a safety timeout to prevent hanging in loading state
    const safetyTimeout = setTimeout(() => {
      if (!hasInitialSessionChecked) {
        console.warn('🟠 Safety timeout reached: forcing loading state to false');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      console.log("🔄 Cleaning up auth state listener");
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
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

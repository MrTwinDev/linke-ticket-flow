
// src/hooks/useAuthOperations.ts
import { supabase } from "@/integrations/supabase/client";
import { ProfileType, RegisterData, User } from "@/types/auth";

interface UseAuthOperationsProps {
  setCurrentUser: (user: User | null) => void;
  setProfileType: (profileType: ProfileType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
}

export function useAuthOperations({
  setCurrentUser,
  setProfileType,
  setIsAuthenticated,
  setIsLoading,
  toast
}: UseAuthOperationsProps) {
  
  // Login function
  const login = async (
    email: string,
    password: string,
    requestedProfile: ProfileType
  ) => {
    setIsLoading(true);
    try {
      console.log("Auth context login attempt with:", { email, requestedProfile });
      
      // Clear any existing auth state to prevent issues
      localStorage.removeItem('sb-qainlosbrisovatxvxxx-auth-token');
      // Clear any other potential auth tokens
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt to sign in with provided credentials
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("User authenticated, checking profile type");
        const { data: prof, error: profErr } = await supabase
          .from('profiles')
          .select('profile_type')
          .eq('id', data.user.id)
          .single();
          
        if (profErr) {
          console.error("Profile fetch error:", profErr);
          throw profErr;
        }
        
        if (prof.profile_type !== requestedProfile) {
          console.error("Profile type mismatch:", { requested: requestedProfile, actual: prof.profile_type });
          await supabase.auth.signOut();
          throw new Error(`Você não possui um perfil ${requestedProfile} para este e-mail.`);
        }
        
        console.log("Login successful with matching profile type");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        variant: 'destructive',
        title: 'Falha ao sair',
        description: 'Não foi possível encerrar a sessão.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // 1) Create user in Auth
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (signUpErr) throw signUpErr;
      const user = signUpData.user;
      if (!user) throw new Error('Falha ao criar usuário.');

      // 2) Update profile (trigger already inserted the row)
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
      const { error: updErr } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (updErr) throw updErr;

      // 3) AUTOMATIC LOGIN AFTER REGISTRATION
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (signInErr) {
        console.error('Error in automatic login:', signInErr);
        await supabase.auth.signOut();
        throw new Error(`Registration completed, but login failed: ${signInErr.message}`);
      }

      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso e você foi autenticado.",
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      await supabase.auth.signOut();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, register };
}

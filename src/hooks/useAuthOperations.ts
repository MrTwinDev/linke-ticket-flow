
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
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
      cleanupAuthState(); // Clean up any previous auth state
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      console.log("✅ Authentication successful:", data);
      
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profileError) throw profileError;

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

      return data;
    } catch (err: any) {
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
      cleanupAuthState(); // Clean up local storage first
      await supabase.auth.signOut();
      setCurrentUser(null);
      setProfileType(null);
      setIsAuthenticated(false);
      console.log("✅ Logout successful");
    } catch (err: any) {
      console.error("🔴 Logout error:", err);
      toast({ variant: 'destructive', title: 'Falha ao sair', description: 'Não foi possível encerrar a sessão.' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      console.log("🟢 Attempting registration for:", data.email);
      
      // Clean up any existing auth state first
      cleanupAuthState();

      // 1) Create user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (signUpError) throw signUpError;
      const user = signUpData.user;
      if (!user) throw new Error("Falha ao criar usuário.");

      // 2) Update profile record (trigger created the row)
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

      // 3) Session is already established by signUp, but we can set state manually
      setIsAuthenticated(true);
      setProfileType(data.profileType);
      setCurrentUser({
        id: user.id,
        email: user.email || '',
        profileType: data.profileType,
        personType:  data.personType,
        phone:       data.phone,
        documentNumber: data.documentNumber,
        address:        data.address,
        ...(data.personType === 'PF'
          ? { fullName: data.fullName }
          : {
              companyName:     data.companyName,
              responsibleName: data.responsibleName,
              responsibleCpf:  data.responsibleCpf,
            }),
      });
      console.log("✅ Registration and profile update successful");

      toast({ title: "Registro bem-sucedido", description: "Sua conta foi criada com sucesso e você foi autenticado." });
      return signUpData;
    } catch (err: any) {
      console.error('🔴 Registration error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, register };
};


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType, PersonType } from "@/contexts/AuthContext";
import { validateStep1, validateStep2, validateStep3 } from "@/utils/registerValidation";
import { supabase } from "@/integrations/supabase/client";  // Fixed import path

export const useRegisterForm = () => {
  // Form steps
  const [step, setStep] = useState(1);
  
  // Profile type state
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [personType, setPersonType] = useState<PersonType>("PF");
  
  // Person data
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleCpf, setResponsibleCpf] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Address data
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  // Security data
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Reset fields based on profile type and person type
  const resetFields = () => {
    if (personType === "PF") {
      setCompanyName("");
      setResponsibleName("");
      setResponsibleCpf("");
    } else {
      setFullName("");
    }
    setDocumentNumber("");
  };

  // Form navigation
  const handleNextStep = () => {
    if (step === 1) {
      const validationErrors = validateStep1(
        personType,
        fullName,
        companyName,
        responsibleName,
        responsibleCpf,
        documentNumber,
        email,
        phone
      );
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
      setStep(2);
    } else if (step === 2) {
      const validationErrors = validateStep2(
        cep,
        street,
        number,
        neighborhood,
        city,
        state
      );
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateStep3(password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      // 1) Cria o usuário no Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      const user = signUpData.user;
      if (!user) throw new Error("Usuário não retornado no cadastro.");

      // 2) Atualiza o perfil que já existe (trigger no banco criou a linha)
      const updates: any = {
        profile_type: profileType,
        person_type: personType,
        phone,
        document_number: documentNumber,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
      };
      if (personType === "PF") {
        updates.full_name = fullName;
      } else {
        updates.company_name = companyName;
        updates.responsible_name = responsibleName;
        updates.responsible_cpf = responsibleCpf;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 3) Sucesso
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      // Taxa limite (rate limit) ou outros erros
      if (
        error.code === "over_email_send_rate_limit" ||
        (error.message?.includes("security purposes") &&
          error.message.includes("after"))
      ) {
        setApiError(
          "Por motivos de segurança, você só pode solicitar isto novamente após alguns segundos."
        );
      } else if (error.message?.includes("violates row-level security policy")) {
        // Handling RLS policy violation
        setApiError("Erro de permissão: não foi possível atualizar o perfil.");
      } else {
        setApiError(error.message || "Ocorreu um erro durante o registro.");
      }
      toast({
        variant: "destructive",
        title: "Falha no registro",
        description: error.message || "Ocorreu um erro durante o registro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Form state
    step,
    
    // Profile type state
    profileType, setProfileType,
    personType, setPersonType,
    
    // Person data
    fullName, setFullName,
    companyName, setCompanyName,
    responsibleName, setResponsibleName,
    responsibleCpf, setResponsibleCpf,
    documentNumber, setDocumentNumber,
    email, setEmail,
    phone, setPhone,
    
    // Address data
    cep, setCep,
    street, setStreet,
    number, setNumber,
    complement, setComplement,
    neighborhood, setNeighborhood,
    city, setCity,
    state, setState,
    
    // Security data
    password, setPassword,
    confirmPassword, setConfirmPassword,
    
    // UI state
    errors,
    isLoading,
    apiError,
    
    // Functions
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    resetFields,
  };
};

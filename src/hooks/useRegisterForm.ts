
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProfileType, PersonType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { validateStep1, validateStep2, validateStep3 } from "@/utils/registerValidation";

export const useRegisterForm = () => {
  const [step, setStep] = useState(1);
  const { register } = useAuth();

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

  const handleNextStep = () => {
    if (step === 1) {
      const validationErrors = validateStep1(
        email,
        phone,
        personType,
        fullName,
        documentNumber,
        companyName,
        responsibleName,
        responsibleCpf
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    console.log("🟢 Registration submission initiated");

    // Validate password
    const validationErrors = validateStep3(password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      console.log("🔴 Password validation failed", validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data
      const registerData = {
        email,
        password,
        profileType,
        personType,
        phone,
        documentNumber,
        address: {
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
        },
        ...(personType === "PF" 
          ? { fullName } 
          : { companyName, responsibleName, responsibleCpf })
      };

      console.log("🟢 Submitting registration data");
      await register(registerData);
      
      // If registration succeeds, navigate to dashboard
      console.log("🚀 Registration successful, redirecting to /dashboard");
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso e você foi autenticado.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("🔴 Registration error:", error);
      
      // Format the error message for display
      let errorMessage = "Ocorreu um erro durante o registro.";
      
      if (error.message?.includes("security purposes") && error.message.includes("after")) {
        errorMessage = "Por motivos de segurança, você só pode solicitar isto novamente após alguns segundos.";
      } else if (error.message?.includes("Failed to fetch")) {
        errorMessage = "Erro de conexão com o servidor. Verifique sua conexão e tente novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Falha no registro",
        description: errorMessage,
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


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType, PersonType } from "@/contexts/AuthContext";
import { validateStep1, validateStep2, validateStep3 } from "@/utils/registerValidation";

export const useRegisterForm = () => {
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [personType, setPersonType] = useState<PersonType>("PF");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleCpf, setResponsibleCpf] = useState("");
  
  // Step 2 fields
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  // Step 3 fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Handle next step
  const handleNextStep = () => {
    setApiError(null);
    
    if (step === 1) {
      const validationErrors = validateStep1(
        email, phone, personType, fullName, documentNumber,
        companyName, responsibleName, responsibleCpf
      );
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        setStep(2);
      }
    } else if (step === 2) {
      const validationErrors = validateStep2(
        cep, street, number, neighborhood, city, state
      );
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        setStep(3);
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setApiError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    
    const validationErrors = validateStep3(password, confirmPassword);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        profileType,
        personType,
        email,
        password,
        phone,
        documentNumber,
        address: {
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state
        }
      };
      
      // Add conditional fields based on person type
      if (personType === "PF") {
        Object.assign(userData, { fullName });
      } else {
        Object.assign(userData, {
          companyName,
          responsibleName,
          responsibleCpf
        });
      }
      
      await register(userData);
      
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      
      // Handle rate limit error specifically
      if (error.code === "over_email_send_rate_limit" || 
          (error.message && error.message.includes("security purposes") && error.message.includes("after 49 seconds"))) {
        setApiError("Por motivos de segurança, você só pode solicitar isto após 49 segundos. Por favor, aguarde e tente novamente.");
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

  // Reset fields when profile or person type changes
  const resetFields = () => {
    setErrors({});
    setApiError(null);
    setFullName("");
    setCompanyName("");
    setResponsibleName("");
    setResponsibleCpf("");
    setDocumentNumber("");
  };

  return {
    // State
    profileType,
    setProfileType,
    personType,
    setPersonType,
    isLoading,
    step,
    errors,
    apiError,
    
    // Step 1 fields
    fullName,
    setFullName,
    companyName,
    setCompanyName,
    email,
    setEmail,
    phone,
    setPhone,
    documentNumber,
    setDocumentNumber,
    responsibleName,
    setResponsibleName,
    responsibleCpf,
    setResponsibleCpf,
    
    // Step 2 fields
    cep,
    setCep,
    street,
    setStreet,
    number,
    setNumber,
    complement,
    setComplement,
    neighborhood,
    setNeighborhood,
    city,
    setCity,
    state,
    setState,
    
    // Step 3 fields
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    
    // Actions
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    resetFields,
  };
};

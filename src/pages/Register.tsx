
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType, PersonType } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProfileTypeSelector from "@/components/register/ProfileTypeSelector";
import ProgressIndicator from "@/components/register/ProgressIndicator";
import Step1ProfileInfo from "@/components/register/Step1ProfileInfo";
import Step2Address from "@/components/register/Step2Address";
import Step3Security from "@/components/register/Step3Security";
import { validateStep1, validateStep2, validateStep3 } from "@/utils/registerValidation";

const Register = () => {
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [personType, setPersonType] = useState<PersonType>("PF");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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

  const stepNames = ["Informações do Perfil", "Endereço", "Segurança"];
  
  // Handle next step
  const handleNextStep = () => {
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
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      await register(userData as any);
      
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Falha no registro",
        description: "Ocorreu um erro durante o registro.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset fields when profile or person type changes
  useEffect(() => {
    setErrors({});
    setFullName("");
    setCompanyName("");
    setResponsibleName("");
    setResponsibleCpf("");
    setDocumentNumber("");
  }, [profileType, personType]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1ProfileInfo 
            personType={personType}
            setPersonType={setPersonType}
            fullName={fullName}
            setFullName={setFullName}
            companyName={companyName}
            setCompanyName={setCompanyName}
            responsibleName={responsibleName}
            setResponsibleName={setResponsibleName}
            responsibleCpf={responsibleCpf}
            setResponsibleCpf={setResponsibleCpf}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            errors={errors}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <Step2Address 
            cep={cep}
            setCep={setCep}
            street={street}
            setStreet={setStreet}
            number={number}
            setNumber={setNumber}
            complement={complement}
            setComplement={setComplement}
            neighborhood={neighborhood}
            setNeighborhood={setNeighborhood}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            errors={errors}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <Step3Security 
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            onSubmit={handleSubmit}
            onPrev={handlePrevStep}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Criar uma conta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Junte-se ao LinkeImport para simplificar seus processos aduaneiros
            </p>
          </div>

          <ProfileTypeSelector 
            profileType={profileType} 
            onProfileTypeChange={setProfileType}
          />

          <div className="mb-6">
            <ProgressIndicator 
              currentStep={step} 
              totalSteps={3} 
              stepNames={stepNames}
            />

            {/* Main content area */}
            <div className="content-area">
              {profileType === "importer" ? (
                // Importer registration form
                renderStepContent()
              ) : (
                // Broker registration form
                <div className="text-sm text-center text-gray-600">
                  O formulário de registro para despachante tem a mesma estrutura que o formulário de importador.
                  A validação e campos são idênticos.
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Já possui uma conta?{" "}
              <Link to="/login" className="text-linkeblue-600 hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProfileTypeSelector from "@/components/register/ProfileTypeSelector";
import ProgressIndicator from "@/components/register/ProgressIndicator";
import Step1ProfileInfo from "@/components/register/Step1ProfileInfo";
import Step2Address from "@/components/register/Step2Address";
import Step3Security from "@/components/register/Step3Security";
import RegisterHeader from "@/components/register/RegisterHeader";
import ErrorMessage from "@/components/register/ErrorMessage";
import LoginLink from "@/components/register/LoginLink";
import { useRegisterForm } from "@/hooks/useRegisterForm";

const Register = () => {
  const {
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
  } = useRegisterForm();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const stepNames = ["Informações do Perfil", "Endereço", "Segurança"];
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  // Reset fields when profile or person type changes
  useEffect(() => {
    resetFields();
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
          <RegisterHeader />
          <ErrorMessage message={apiError} />

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

            <div className="content-area">
              {renderStepContent()}
            </div>
          </div>

          <LoginLink />
        </div>
      </div>
    </div>
  );
};

export default Register;

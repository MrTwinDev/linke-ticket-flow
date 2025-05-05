
import { isValidCPF, isValidCNPJ, isValidPhone, isValidEmail, isValidCEP } from "@/utils/validation";
import { PersonType } from "@/contexts/AuthContext";

// Step 1 validation
export const validateStep1 = (
  email: string,
  phone: string,
  personType: PersonType,
  fullName: string,
  documentNumber: string,
  companyName: string,
  responsibleName: string,
  responsibleCpf: string
) => {
  const errors: Record<string, string> = {};
  
  if (!email || !isValidEmail(email)) {
    errors.email = "Por favor, insira um endereço de e-mail válido";
  }
  
  if (!phone || !isValidPhone(phone)) {
    errors.phone = "Por favor, insira um número de telefone válido";
  }
  
  if (personType === "PF") {
    if (!fullName.trim()) {
      errors.fullName = "Nome completo é obrigatório";
    }
    
    if (!documentNumber || !isValidCPF(documentNumber)) {
      errors.documentNumber = "Por favor, insira um CPF válido";
    }
  } else {
    if (!companyName.trim()) {
      errors.companyName = "Nome da empresa é obrigatório";
    }
    
    if (!documentNumber || !isValidCNPJ(documentNumber)) {
      errors.documentNumber = "Por favor, insira um CNPJ válido";
    }
    
    if (!responsibleName.trim()) {
      errors.responsibleName = "Nome do responsável é obrigatório";
    }
    
    if (!responsibleCpf || !isValidCPF(responsibleCpf)) {
      errors.responsibleCpf = "Por favor, insira um CPF válido para o responsável";
    }
  }
  
  return errors;
};

// Step 2 validation
export const validateStep2 = (
  cep: string,
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string
) => {
  const errors: Record<string, string> = {};
  
  if (!cep || !isValidCEP(cep)) {
    errors.cep = "Por favor, insira um CEP válido";
  }
  
  if (!street.trim()) {
    errors.street = "Logradouro é obrigatório";
  }
  
  if (!number.trim()) {
    errors.number = "Número é obrigatório";
  }
  
  if (!neighborhood.trim()) {
    errors.neighborhood = "Bairro é obrigatório";
  }
  
  if (!city.trim()) {
    errors.city = "Cidade é obrigatória";
  }
  
  if (!state.trim()) {
    errors.state = "Estado é obrigatório";
  }
  
  return errors;
};

// Step 3 validation
export const validateStep3 = (
  password: string,
  confirmPassword: string
) => {
  const errors: Record<string, string> = {};
  
  if (!password.trim() || password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres";
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem";
  }
  
  return errors;
};

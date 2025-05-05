
// CPF validation
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = (sum * 10) % 11;
  if (checkDigit === 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = (sum * 10) % 11;
  if (checkDigit === 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// CNPJ validation
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Validate first check digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  // Validate second check digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

// Phone validation - simplified
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  // Brazilian phone: DDD (2 digits) + number (8-9 digits)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// CEP validation
export const isValidCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/[^\d]/g, '');
  return cleanCEP.length === 8;
};

// Format document number with mask
export const formatCPF = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const formatCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const formatCEP = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

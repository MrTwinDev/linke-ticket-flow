
// src/types/auth.ts
export type ProfileType = "importer" | "broker";
export type PersonType = "PF" | "PJ";

export interface User {
  id: string;
  email: string;
  profileType: ProfileType;
  personType: PersonType;
  fullName?: string;
  companyName?: string;
  phone: string;
  documentNumber: string;
  responsibleName?: string;
  responsibleCpf?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  profileType: ProfileType;
  personType: PersonType;
  fullName?: string;
  companyName?: string;
  phone: string;
  documentNumber: string;
  responsibleName?: string;
  responsibleCpf?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

// Update the return types to match what Supabase functions return
export interface AuthContextType {
  currentUser: User | null;
  profileType: ProfileType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<any>;
}

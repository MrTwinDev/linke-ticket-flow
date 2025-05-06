
// src/contexts/AuthContext.tsx
// This file now re-exports from the new files for backward compatibility
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { User, ProfileType, PersonType, RegisterData } from "@/types/auth";

export { AuthProvider, useAuth };
export type { User, ProfileType, PersonType, RegisterData };
export type { User as AuthUser };

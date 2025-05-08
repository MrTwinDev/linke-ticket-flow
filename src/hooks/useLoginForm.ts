
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState } from "@/integrations/supabase/client";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("🟢 Login attempt:", { email, profileType });
      
      // Clean up any existing auth state to prevent conflicts
      cleanupAuthState();

      // Try the login operation
      const result = await login(email, password, profileType);
      
      console.log("✅ Login successful", result);

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileType === "importer" ? "importador" : "despachante"}.`,
      });

      console.log("🚀 Redirecting to /dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("🔴 Login error:", err);
      
      // Provide more specific error messages
      let errorMessage = "Falha na autenticação. Verifique suas credenciais.";
      
      if (err.message === "Failed to fetch" || err.message?.includes("fetch")) {
        errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
      } else if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas. Por favor, verifique seu email e senha.";
      } else if (err.message?.includes("Invalid API key")) {
        errorMessage = "Problema na configuração da API. Por favor, contacte o suporte.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    profileType,
    setProfileType,
    isLoading,
    error,
    handleSubmit
  };
};

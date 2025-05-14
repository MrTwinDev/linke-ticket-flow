
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
      
      // Try the login operation
      const result = await login(email, password, profileType);
      
      console.log("✅ Login bem-sucedido, exibindo toast de sucesso");

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileType === "importer" ? "importador" : "despachante"}.`,
      });

      // Reset form state after successful login
      setIsLoading(false);
      
      console.log("🚀 Redirecionando para /dashboard...");
      // Use navigate here to ensure the redirection happens even if the 
      // automatic redirect in Login.tsx useEffect doesn't trigger
      navigate("/dashboard");
    } catch (err: any) {
      console.error("🔴 Erro de login:", err);
      
      // Provide more specific error messages
      let errorMessage = "Falha na autenticação. Verifique suas credenciais.";
      
      if (err.message === "Failed to fetch" || err.message?.includes("fetch")) {
        errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
      } else if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas. Por favor, verifique seu email e senha.";
      } else if (err.message?.includes("Invalid API key")) {
        errorMessage = "Problema na configuração da API. Por favor, contacte o suporte técnico.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
      });
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

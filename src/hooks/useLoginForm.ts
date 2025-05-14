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
      console.log("🟢 Tentando login com:", { email, profileType });

      const result = await login(email, password, profileType);

      console.log("🎯 Resultado da função login:", result);

      if (!result || result?.error) {
        throw new Error(result?.error?.message || "Falha no login.");
      }

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileType === "importer" ? "importador" : "despachante"}.`,
      });

      console.log("🚀 Redirecionando para /dashboard");
      window.location.href = "/dashboard"; // Fallback direto

      // Fallback adicional em caso de falha silenciosa
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (err: any) {
      console.error("🔴 Erro de login capturado:", err);

      let errorMessage = "Falha na autenticação. Verifique suas credenciais.";

      if (err.message?.includes("Failed to fetch")) {
        errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
      } else if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas. Verifique email e senha.";
      } else if (err.message?.includes("Invalid API key")) {
        errorMessage = "Erro na API. Contate o suporte técnico.";
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
    handleSubmit,
  };
};

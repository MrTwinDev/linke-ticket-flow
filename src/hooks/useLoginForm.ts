
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.log("🟢 Iniciando login com:", { email });

      // Try the login operation without profile type
      const result = await login(email, password);
      
      console.log("✅ Login realizado com sucesso", result);

      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta.",
      });

      console.log("🚀 Redirecionando para /dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("🔴 Erro durante login:", err);
      
      // Provide more specific error messages
      let errorMessage = "Falha na autenticação. Verifique suas credenciais.";
      
      if (err.message === "Failed to fetch" || err.message?.includes("fetch")) {
        errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
      } else if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas. Por favor, verifique seu email e senha.";
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
    isLoading,
    error,
    handleSubmit
  };
};

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
      console.log("🟢 Iniciando login com:", { email, profileType });

      await login(email, password, profileType);

      console.log("✅ Login realizado com sucesso");

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileType === "importer" ? "importador" : "despachante"}.`,
      });

      console.log("🚀 Redirecionando para /dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("🔴 Erro durante login:", err);
      const msg = err.message || "Falha na autenticação. Verifique suas credenciais.";
      setError(msg);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: msg,
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

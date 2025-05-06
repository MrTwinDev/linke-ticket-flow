// src/hooks/useLoginForm.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useLoginForm() {
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
      await login(email, password, profileType);
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileType === "importer" ? "importador" : "despachante"}.`,
      });
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Erro ao fazer login.";
      setError(msg);
      toast({ variant: "destructive", title: "Falha no login", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, profileType, setProfileType, isLoading, error, handleSubmit };
}

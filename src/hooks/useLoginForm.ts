
// src/hooks/useLoginForm.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState("importer");
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
      console.log("Login attempt initiated:", { email, profileType });
      
      await login(email, password, profileType);
      
      console.log("Login successful, showing toast and navigating");
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${profileType === "importer" ? "importador" : "despachante"}.`,
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error details:", err);
      setError(err.message || "Erro ao fazer login.");
      
      toast({ 
        variant: "destructive", 
        title: "Falha no login", 
        description: err.message || "Erro ao fazer login." 
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
}

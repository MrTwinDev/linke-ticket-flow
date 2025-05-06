
// src/hooks/useLoginForm.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth, ProfileType } from '@/contexts/AuthContext';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('importer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password, profileType);
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta à sua conta de ${
          profileType === "importer" ? "importador" : "despachante"
        }.`,
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.message ||
        "Credenciais inválidas ou você não possui este tipo de perfil.";
      setError(msg);
      toast({
        variant: "destructive",
        title: "Falha no login",
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
    handleSubmit,
  };
}

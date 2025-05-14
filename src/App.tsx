import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    profileType,
    setProfileType,
    isLoading,
    error,
    handleSubmit,
  } = useLoginForm();

  const {
    isAuthenticated,
    isLoading: authLoading,
    profileType: ctxProfile,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log("✅ Autenticado com sucesso, redirecionando para /dashboard");

      // Primeiro tenta com React Router
      navigate("/dashboard");

      // Fallback garantido
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 200);
    }
  }, [isAuthenticated, authLoading, ctxProfile, navigate]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="profileType">Tipo de Usuário</Label>
          <select
            id="profileType"
            className="w-full border rounded p-2"
            value={profileType}
            onChange={(e) => setProfileType(e.target.value as any)}
          >
            <option value="importer">Importador</option>
            <option value="agent">Despachante</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default Login;

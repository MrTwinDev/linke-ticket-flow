
// src/pages/Login.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useLoginForm } from "@/hooks/useLoginForm";

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit
  } = useLoginForm();

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect after authentication
  useEffect(() => {
    console.log("Login.tsx • auth state:", { isAuthenticated, authLoading });
    if (!authLoading && isAuthenticated) {
      console.log("Usuário autenticado → /dashboard");
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-600">
              Insira suas credenciais para acessar sua conta.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Não tem conta?{" "}
            <Link to="/register" className="text-linkeblue-600 hover:underline">
              Registre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

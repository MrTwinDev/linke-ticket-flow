// src/pages/Login.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useLoginForm } from "@/hooks/useLoginForm";
import { ProfileType } from "@/types/auth"; 
import ErrorMessage from "@/components/register/ErrorMessage";

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    profileType,
    setProfileType,
    isLoading,
    error,
    handleSubmit
  } = useLoginForm();

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect after authentication - improved to handle edge cases
  useEffect(() => {
    console.log("Login.tsx • auth state:", { isAuthenticated, authLoading });
    
    // Only redirect if we know the user is authenticated and we're not currently loading
    if (!authLoading && isAuthenticated) {
      console.log("🚀 User authenticated → redirecting to /dashboard");
      navigate("/dashboard", { replace: true });
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

          {error && <ErrorMessage message={error} />}

          <Tabs
            value={profileType}
            onValueChange={(v: string) => setProfileType(v as ProfileType)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="importer">Importador</TabsTrigger>
              <TabsTrigger value="broker">Despachante</TabsTrigger>
            </TabsList>

            {/* Formulário Importador */}
            <TabsContent value="importer">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email-importer">E-mail</Label>
                  <Input
                    id="email-importer"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="pass-importer">Senha</Label>
                  <Input
                    id="pass-importer"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar como Importador"}
                </Button>
              </form>
            </TabsContent>

            {/* Formulário Despachante */}
            <TabsContent value="broker">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email-broker">E-mail</Label>
                  <Input
                    id="email-broker"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="pass-broker">Senha</Label>
                  <Input
                    id="pass-broker"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar como Despachante"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-gray-600">
            Não tem conta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

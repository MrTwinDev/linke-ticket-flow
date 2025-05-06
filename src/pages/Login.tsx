// src/pages/Login.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import { useLoginForm } from "@/hooks/useLoginForm";

const Login: React.FC = () => {
  // Lógica de formulário (estado, handlers) isolada no hook
  const {
    email,
    setEmail,
    password,
    setPassword,
    profileType,
    setProfileType,
    isLoading,
    error: errorMessage,
    handleSubmit
  } = useLoginForm();

  // Contexto de autenticação
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Se já estiver logado, redireciona ao dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow space-y-6">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Por favor, insira suas credenciais para acessar sua conta
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-100 text-red-800 rounded">
              {errorMessage}
            </div>
          )}

          <Tabs
            value={profileType}
            onValueChange={(val) => setProfileType(val as ProfileType)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="importer">Importador</TabsTrigger>
              <TabsTrigger value="broker">Despachante Aduaneiro</TabsTrigger>
            </TabsList>

            {/* Formulário Importador */}
            <TabsContent value="importer">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email-importer">Endereço de e-mail</Label>
                  <Input
                    id="email-importer"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="pass-importer">Senha</Label>
                  <Input
                    id="pass-importer"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <Label htmlFor="email-broker">Endereço de e-mail</Label>
                  <Input
                    id="email-broker"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@despachante.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="pass-broker">Senha</Label>
                  <Input
                    id="pass-broker"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            <Link to="/register" className="text-linkeblue-600 hover:underline">
              Registre-se agora
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500">
            Contas de Demonstração:<br />
            Importador: importer@example.com<br />
            Despachante: broker@example.com<br />
            Senha para ambos: password
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;


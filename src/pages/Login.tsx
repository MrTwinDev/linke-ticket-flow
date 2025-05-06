
// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Login: React.FC = () => {
  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Login.tsx • Submitting form with:", { email, password, profileType });
      
      // Clear any existing auth state to prevent issues
      localStorage.removeItem('sb-qainlosbrisovatxvxxx-auth-token');
      // Clear any other potential auth tokens
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Call the login function from AuthContext
      await login(email, password, profileType);
      
      // If login succeeds, navigate to dashboard
      // This will run only if login doesn't throw an error
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login.tsx • Login failed:", err);
      setError(err.message || "Credenciais inválidas ou perfil incorreto");
    } finally {
      setIsLoading(false);
    }
  };

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

          <Tabs
            value={profileType}
            onValueChange={(v) => setProfileType(v as ProfileType)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="importer">Importador</TabsTrigger>
              <TabsTrigger value="broker">Despachante</TabsTrigger>
            </TabsList>

            {/** Formulário Importador */}
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

            {/** Formulário Despachante */}
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

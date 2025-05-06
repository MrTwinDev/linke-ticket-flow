// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
      const msg =
        err.message ||
        "Credenciais inválidas ou você não possui este tipo de perfil.";
      setErrorMessage(msg);
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: msg,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="importer">Importador</TabsTrigger>
              <TabsTrigger value="broker">Despachante Aduaneiro</TabsTrigger>
            </TabsList>

            <TabsContent value="importer">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="importer-email">Endereço de e-mail</Label>
                    <Input
                      id="importer-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@empresa.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="importer-password">Senha</Label>
                      <Link
                        to="#"
                        className="text-linkeblue-600 text-sm hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="importer-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {authLoading ? "Entrando..." : "Entrar como Importador"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="broker">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="broker-email">Endereço de e-mail</Label>
                    <Input
                      id="broker-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@despachante.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="broker-password">Senha</Label>
                      <Link
                        to="#"
                        className="text-linkeblue-600 text-sm hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="broker-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {authLoading ? "Entrando..." : "Entrar como Despachante"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-linkeblue-600 hover:underline"
              >
                Registre-se agora
              </Link>
            </p>
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            <p>
              Contas de Demonstração:<br />
              Importador: importer@example.com<br />
              Despachante: broker@example.com<br />
              Senha para ambos: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

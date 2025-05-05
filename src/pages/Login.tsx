
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("importer");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, profileType);
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta à sua conta de ${profileType === "importer" ? "importador" : "despachante"}.`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: "Credenciais inválidas ou você não possui este tipo de perfil.",
      });
    } finally {
      setIsLoading(false);
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

          <Tabs defaultValue="importer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="importer" 
                onClick={() => setProfileType("importer")}
              >
                Importador
              </TabsTrigger>
              <TabsTrigger 
                value="broker" 
                onClick={() => setProfileType("broker")}
              >
                Despachante Aduaneiro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="importer">
              <form className="mt-4 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="importer-email">Endereço de e-mail</Label>
                    <Input
                      id="importer-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="voce@empresa.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="importer-password">Senha</Label>
                      <div className="text-sm">
                        <a href="#" className="text-linkeblue-600 hover:underline">
                          Esqueceu a senha?
                        </a>
                      </div>
                    </div>
                    <Input
                      id="importer-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar como Importador"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="broker">
              <form className="mt-4 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="broker-email">Endereço de e-mail</Label>
                    <Input
                      id="broker-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="voce@despachante.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="broker-password">Senha</Label>
                      <div className="text-sm">
                        <a href="#" className="text-linkeblue-600 hover:underline">
                          Esqueceu a senha?
                        </a>
                      </div>
                    </div>
                    <Input
                      id="broker-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar como Despachante"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-linkeblue-600 hover:underline">
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

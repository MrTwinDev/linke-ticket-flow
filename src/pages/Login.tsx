
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
        title: "Login successful",
        description: `Welcome back to your ${profileType} account.`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials or you don't have this profile type.",
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
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your credentials to access your account
            </p>
          </div>

          <Tabs defaultValue="importer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="importer" 
                onClick={() => setProfileType("importer")}
              >
                Importer
              </TabsTrigger>
              <TabsTrigger 
                value="broker" 
                onClick={() => setProfileType("broker")}
              >
                Customs Broker
              </TabsTrigger>
            </TabsList>

            <TabsContent value="importer">
              <form className="mt-4 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="importer-email">Email address</Label>
                    <Input
                      id="importer-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="importer-password">Password</Label>
                      <div className="text-sm">
                        <a href="#" className="text-linkeblue-600 hover:underline">
                          Forgot password?
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
                    {isLoading ? "Signing in..." : "Sign in as Importer"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="broker">
              <form className="mt-4 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="broker-email">Email address</Label>
                    <Input
                      id="broker-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="you@broker.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="broker-password">Password</Label>
                      <div className="text-sm">
                        <a href="#" className="text-linkeblue-600 hover:underline">
                          Forgot password?
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
                    {isLoading ? "Signing in..." : "Sign in as Broker"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-linkeblue-600 hover:underline">
                Register now
              </Link>
            </p>
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>
              Demo Accounts:<br />
              Importer: importer@example.com<br />
              Broker: broker@example.com<br />
              Password for both: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

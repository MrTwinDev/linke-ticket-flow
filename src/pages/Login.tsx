// src/pages/Login.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Login: React.FC = () => {
  const {
    email, setEmail,
    password, setPassword,
    profileType, setProfileType,
    isLoading, error: errorMessage,
    handleSubmit
  } = useLoginForm();

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate("/dashboard");
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <div className="flex-grow flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white p-8 rounded shadow space-y-6">
          <h2 className="text-2xl font-bold text-center">Bem-vindo de volta</h2>
          {errorMessage && <div className="p-2 bg-red-100 text-red-800 rounded">{errorMessage}</div>}

          <Tabs value={profileType} onValueChange={val => setProfileType(val as ProfileType)}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="importer">Importador</TabsTrigger>
              <TabsTrigger value="broker">Despachante</TabsTrigger>
            </TabsList>

            <TabsContent value="importer">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>E-mail</Label>
                  <Input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required disabled={isLoading}/>
                </div>
                <div>
                  <Label>Senha</Label>
                  <Input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    required disabled={isLoading}/>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Entrando..." : "Entrar como Importador"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="broker">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>E-mail</Label>
                  <Input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required disabled={isLoading}/>
                </div>
                <div>
                  <Label>Senha</Label>
                  <Input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    required disabled={isLoading}/>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Entrando..." : "Entrar como Despachante"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm">
            Não tem conta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

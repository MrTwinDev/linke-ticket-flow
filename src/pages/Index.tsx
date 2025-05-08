
// src/pages/Index.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Sistema</h1>
        <p className="text-xl text-gray-600 mb-6">Plataforma para importadores e despachantes</p>
        
        {isLoading ? (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : isAuthenticated ? (
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to="/dashboard">Acessar Dashboard</Link>
          </Button>
        ) : (
          <div className="space-y-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">Criar Conta</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

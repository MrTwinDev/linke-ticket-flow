import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DebugPage: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("🔍 Supabase getSession:", data);
        setSessionData(data);
      } catch (err) {
        console.error("🔴 Erro ao buscar sessão do Supabase:", err);
      }
    };

    fetchSession();
  }, []);

  console.log("🧪 Auth state via useAuth:", {
    isAuthenticated,
    isLoading,
    currentUser,
  });

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">🔍 Diagnóstico de Sessão</h1>
      <p><strong>Auth Loading:</strong> {String(isLoading)}</p>
      <p><strong>isAuthenticated:</strong> {String(isAuthenticated)}</p>
      <p><strong>Usuário:</strong> {currentUser?.email || "Nenhum carregado"}</p>
      <p><strong>ID Supabase:</strong> {currentUser?.id || "Sem ID"}</p>

      <hr className="my-4" />

      <p><strong>Supabase Session:</strong></p>
      <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-w-full">
        {JSON.stringify(sessionData, null, 2)}
      </pre>
    </div>
  );
};

export default DebugPage;

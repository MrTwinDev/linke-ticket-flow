import React, { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DebugPage: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      console.log("🧪 Supabase session:", session);
    })();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">🔍 Diagnóstico de Sessão</h1>
      <p><strong>isLoading:</strong> {String(isLoading)}</p>
      <p><strong>isAuthenticated:</strong> {String(isAuthenticated)}</p>
      <p><strong>Usuário:</strong> {currentUser?.email || "Nenhum usuário carregado"}</p>
    </div>
  );
};

export default DebugPage;

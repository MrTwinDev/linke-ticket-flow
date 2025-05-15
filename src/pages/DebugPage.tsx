import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DebugPage = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("📦 Sessão atual:", data?.session);
      setSession(data?.session);
      setLoading(false);
    };

    loadSession();
  }, []);

  if (loading) {
    return <div style={{ padding: 32 }}>⏳ Carregando sessão do Supabase...</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>✅ Diagnóstico Supabase</h1>
      <p>Usuário autenticado:</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default DebugPage;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DebugPage = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("🧪 Session from Supabase:", data);
      setSession(data?.session);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ padding: 32 }}>⏳ Carregando sessão...</p>;

  return (
    <div style={{ padding: 32 }}>
      <h1>🧪 Diagnóstico Supabase</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default DebugPage;

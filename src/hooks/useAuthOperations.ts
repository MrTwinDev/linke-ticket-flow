
const register = async (data: RegisterData) => {
  setIsLoading(true);
  try {
    const response = await fetch('https://qainlosbrisovatxvxxx.supabase.co/functions/v1/autoconfirm-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        profileType: data.profileType,
        personType: data.personType,
        phone: data.phone,
        documentNumber: data.documentNumber,
        address: data.address,
        fullName: data.fullName,
        companyName: data.companyName,
        responsibleName: data.responsibleName,
        responsibleCpf: data.responsibleCpf
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no registro.');
    }

    const result = await response.json();

    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInErr) {
      console.error('Erro no login automático:', signInErr);
      throw new Error(`Cadastro realizado, mas o login falhou: ${signInErr.message}`);
    }

    if (signInData.user) {
      setIsAuthenticated(true);
      setCurrentUser({
        id: signInData.user.id,
        email: signInData.user.email || '',
        profileType: data.profileType,
        personType: data.personType,
        phone: data.phone,
        documentNumber: data.documentNumber,
        address: data.address,
        ...(data.personType === 'PF'
          ? { fullName: data.fullName }
          : {
              companyName: data.companyName,
              responsibleName: data.responsibleName,
              responsibleCpf: data.responsibleCpf,
            }),
      });
      setProfileType(data.profileType);
    }

    toast({
      title: "Registro bem-sucedido",
      description: "Sua conta foi criada com sucesso e você foi autenticado.",
    });

    return signInData;
  } catch (err: any) {
    console.error('Registration error:', err);
    throw err;
  } finally {
    setIsLoading(false);
  }
};

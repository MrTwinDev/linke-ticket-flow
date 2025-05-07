const register = async (data: RegisterData) => {
  setIsLoading(true);
  try {
    const response = await fetch('https://qainlosbrisovatxvxxx.supabase.co/functions/v1/autoconfirm-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'SUA_SUPABASE_ANON_KEY',
        'Authorization': 'Bearer SUA_SUPABASE_ANON_KEY',
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

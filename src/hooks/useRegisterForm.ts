
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType, PersonType } from "@/contexts/AuthContext";
import { validateStep1, validateStep2, validateStep3 } from "@/utils/registerValidation";
import { supabase } from "@/integrations/supabase/client";  // Fixed import path

export const useRegisterForm = () => {
  // ... estados omitidos para brevidade ...

  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateStep3(password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      // 1) Cria o usuário no Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      const user = signUpData.user;
      if (!user) throw new Error("Usuário não retornado no cadastro.");

      // 2) Atualiza o perfil que já existe (trigger no banco criou a linha)
      const updates: any = {
        profile_type: profileType,
        person_type: personType,
        phone,
        document_number: documentNumber,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
      };
      if (personType === "PF") {
        updates.full_name = fullName;
      } else {
        updates.company_name = companyName;
        updates.responsible_name = responsibleName;
        updates.responsible_cpf = responsibleCpf;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 3) Sucesso
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      // Taxa limite (rate limit) ou outros erros
      if (
        error.code === "over_email_send_rate_limit" ||
        (error.message?.includes("security purposes") &&
          error.message.includes("after"))
      ) {
        setApiError(
          "Por motivos de segurança, você só pode solicitar isto novamente após alguns segundos."
        );
      } else if (error.message?.includes("violates row-level security policy")) {
        // Handling RLS policy violation
        setApiError("Erro de permissão: não foi possível atualizar o perfil.");
      } else {
        setApiError(error.message || "Ocorreu um erro durante o registro.");
      }
      toast({
        variant: "destructive",
        title: "Falha no registro",
        description: error.message || "Ocorreu um erro durante o registro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto do hook ...
  return {
    // ... tudo como antes, incluindo handleSubmit ...
    handleSubmit,
  };
};

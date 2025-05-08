// src/pages/ProfilePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Form } from "@/components/ui/form";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { AddressForm } from "@/components/profile/AddressForm";
import { ProfileActions } from "@/components/profile/ProfileActions";

// Schema de validação com Zod
const profileSchema = z.object({
  fullName: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  phone: z.string().min(10, { message: "Telefone inválido" }).max(15),
  documentNumber: z.string().min(11, { message: "CPF/CNPJ inválido" }),
  street: z.string().min(3, { message: "Endereço deve ter no mínimo 3 caracteres" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro deve ter no mínimo 2 caracteres" }),
  city: z.string().min(2, { message: "Cidade deve ter no mínimo 2 caracteres" }),
  state: z.string().min(2, { message: "Estado deve ter no mínimo 2 caracteres" }),
  cep: z.string().min(8, { message: "CEP inválido" }).max(9),
  responsibleName: z.string().optional(),
  responsibleCpf: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { currentUser, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  // Inicializa o formulário
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      documentNumber: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      cep: "",
      responsibleName: "",
      responsibleCpf: "",
    },
  });

  // Lida com troca de avatar
  const handleAvatarChange = (file: File | null, preview: string | null) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
    if (!file && !preview) setAvatar(null);
  };

  // Carrega dados do usuário ao montar
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser?.id) return;
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        if (error) throw error;
        if (data) {
          form.reset({
            fullName: data.full_name || data.company_name || "",
            phone: data.phone || "",
            documentNumber: data.document_number || "",
            street: data.street || "",
            number: data.number || "",
            complement: data.complement || "",
            neighborhood: data.neighborhood || "",
            city: data.city || "",
            state: data.state || "",
            cep: data.cep || "",
            responsibleName: data.responsible_name || "",
            responsibleCpf: data.responsible_cpf || "",
          });
          setEmail(currentUser.email || "");
          setUpdatedAt(data.updated_at || null);
        }

        const { data: avatarData } = await supabase
          .storage
          .from("avatars")
          .getPublicUrl(`${currentUser.id}.png`);
        if (avatarData.publicUrl) {
          const resp = await fetch(avatarData.publicUrl, { method: "HEAD" });
          if (resp.ok) setAvatar(avatarData.publicUrl);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, form, toast]);

  // Salva alterações no perfil
  const onSubmit = async (values: ProfileFormValues) => {
    if (!currentUser?.id) return;
    setIsSaving(true);

    try {
      // Prepara objeto de update
      const updateData: any = {
        phone: values.phone,
        document_number: values.documentNumber,
        street: values.street,
        number: values.number,
        complement: values.complement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        cep: values.cep,
      };

      if (currentUser.personType === "PF") {
        updateData.full_name = values.fullName;
      } else {
        updateData.company_name = values.fullName;
        updateData.responsible_name = values.responsibleName;
        updateData.responsible_cpf = values.responsibleCpf;
      }

      // Atualiza tabela profiles
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", currentUser.id);
      if (error) throw error;

      // Upload ou remoção de avatar
      if (avatarFile) {
        const { error: uploadErr } = await supabase
          .storage
          .from("avatars")
          .upload(`${currentUser.id}.png`, avatarFile, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data: pub } = await supabase
          .storage
          .from("avatars")
          .getPublicUrl(`${currentUser.id}.png`);
        setAvatar(pub.publicUrl);
        setAvatarPreview(null);
      } else if (avatarPreview === null && avatar) {
        await supabase
          .storage
          .from("avatars")
          .remove([`${currentUser.id}.png`]);
        setAvatar(null);
      }

      toast({
        title: "Perfil atualizado",
        description: "Alterações salvas com sucesso!",
      });

      // Atualiza timestamp
      const { data: upd } = await supabase
        .from("profiles")
        .select("updated_at")
        .eq("id", currentUser.id)
        .single();
      if (upd) setUpdatedAt(upd.updated_at);
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: err.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsSaving(false);
      setAvatarFile(null);
    }
  };

  // Exclui (soft-delete) conta e desloga
  const handleDeleteAccount = async () => {
    if (!currentUser?.id) return;
    setIsDeleting(true);

    try {
      // Soft-delete no perfil
      const { error } = await supabase
        .from("profiles")
        .update({
          deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq("id", currentUser.id);
        
      if (error) {
        console.error("Erro ao excluir conta (soft-delete):", error);
        throw error;
      }

      // Encerra sessão
      await logout();
      navigate("/login");

      toast({
        title: "Conta excluída",
        description: "Seu perfil foi desativado e você foi desconectado.",
      });
    } catch (err: any) {
      console.error("Erro ao excluir conta:", err);
      toast({
        variant: "destructive",
        title: "Falha ao excluir conta",
        description: err.message || "Tente novamente mais tarde.",
      });
      setIsDeleting(false);
    }
  };

  // Loading inicial de auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Se não autenticado, redireciona
  if (!currentUser) {
    useEffect(() => {
      navigate("/login");
    }, [navigate]);
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Seu Perfil</h1>

      <div className="space-y-6">
        <ProfileHeader
          isLoading={isLoading}
          currentUser={currentUser}
          fullName={form.getValues("fullName")}
          email={email}
          updatedAt={updatedAt}
          avatar={avatar}
          onAvatarChange={handleAvatarChange}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <PersonalInfoForm
              isLoading={isLoading}
              personType={currentUser.personType}
              email={email}
            />
            <AddressForm isLoading={isLoading} />
            <ProfileActions
              isLoading={isLoading}
              isSaving={isSaving}
              isDeleting={isDeleting}
              onDeleteAccount={handleDeleteAccount}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;

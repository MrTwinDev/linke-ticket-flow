
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

// Import our new components
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { AddressForm } from "@/components/profile/AddressForm";
import { ProfileActions } from "@/components/profile/ProfileActions";

// Define schema for form validation
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
  
  // Form handling with react-hook-form
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

  // Handle avatar change from child component
  const handleAvatarChange = (file: File | null, preview: string | null) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
    
    if (!file && !preview) {
      setAvatar(null);
    }
  };

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser?.id) return;
      
      setIsLoading(true);
      try {
        // Get the complete profile data from Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
          
        if (error) throw error;
        if (data) {
          // Set form values
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
          
          // Set other state variables
          setEmail(currentUser.email || "");
          setUpdatedAt(data.updated_at || null);
        }
        
        // Check if user has avatar in storage
        const { data: avatarData } = await supabase
          .storage
          .from("avatars")
          .getPublicUrl(`${currentUser.id}.png`);
          
        if (avatarData?.publicUrl) {
          // Verify the image exists
          const response = await fetch(avatarData.publicUrl, { method: "HEAD" });
          if (response.ok) {
            setAvatar(avatarData.publicUrl);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do perfil."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, toast]);

  // Save profile changes
  const onSubmit = async (values: ProfileFormValues) => {
    if (!currentUser?.id) return;
    
    setIsSaving(true);
    try {
      // Update profile data in profiles table
      const updateData: Record<string, any> = {
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
      
      // Add conditional fields based on person type
      if (currentUser.personType === "PF") {
        updateData.full_name = values.fullName;
      } else {
        updateData.company_name = values.fullName;
        updateData.responsible_name = values.responsibleName;
        updateData.responsible_cpf = values.responsibleCpf;
      }
      
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", currentUser.id);
        
      if (error) throw error;
      
      // Handle avatar upload if there's a new file
      if (avatarFile) {
        const { error: uploadError } = await supabase
          .storage
          .from("avatars")
          .upload(`${currentUser.id}.png`, avatarFile, {
            upsert: true,
            contentType: avatarFile.type
          });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = await supabase
          .storage
          .from("avatars")
          .getPublicUrl(`${currentUser.id}.png`);
          
        setAvatar(publicUrlData.publicUrl);
        setAvatarPreview(null);
      } else if (avatarPreview === null && avatar !== null) {
        // User wants to remove their avatar
        const { error: removeError } = await supabase
          .storage
          .from("avatars")
          .remove([`${currentUser.id}.png`]);
          
        if (removeError) throw removeError;
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas alterações foram salvas com sucesso."
      });
      
      // Refresh updated_at
      const { data } = await supabase
        .from("profiles")
        .select("updated_at")
        .eq("id", currentUser.id)
        .single();
        
      if (data) {
        setUpdatedAt(data.updated_at);
      }
      
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as alterações."
      });
    } finally {
      setIsSaving(false);
      setAvatarFile(null);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!currentUser?.id) return;
    
    setIsDeleting(true);
    try {
      // Soft delete the profile first
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);
        
      if (updateError) throw updateError;
      
      // Then try to delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        currentUser.id
      );
      
      if (authError) {
        // If admin delete fails, try the regular method
        const { error } = await supabase.auth.admin.deleteUser(currentUser.id);
        if (error) throw error;
      }
      
      // Remove avatar if exists
      try {
        await supabase
          .storage
          .from("avatars")
          .remove([`${currentUser.id}.png`]);
      } catch (e) {
        // Ignore errors removing avatar
        console.log("Nenhum avatar para remover ou erro ao remover:", e);
      }
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente."
      });
      
      // Logout and redirect
      await logout();
      navigate("/login");
      
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir conta",
        description: error.message || "Não foi possível excluir a conta."
      });
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login if not authenticated
    useEffect(() => {
      navigate("/login");
    }, [navigate]);
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
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

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <PersonalInfoForm
              isLoading={isLoading}
              personType={currentUser.personType}
              email={email}
            />

            {/* Address Information */}
            <AddressForm isLoading={isLoading} />

            {/* Actions */}
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


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Loader, Upload, Trash, Copy } from "lucide-react";

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
  
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem."
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB."
      });
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Imagem selecionada",
      description: "Clique em Salvar Alterações para atualizar sua foto."
    });
  };
  
  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatar(null);
    toast({
      title: "Imagem removida",
      description: "Clique em Salvar Alterações para confirmar."
    });
  };

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
      setAvatarFile(null); // Clear the file input
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!currentUser?.id) return;
    
    setIsDeleting(true);
    try {
      // First try to delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        currentUser.id
      );
      
      if (authError) {
        // If admin delete fails, try the regular method
        const { error } = await supabase.auth.admin.deleteUser(currentUser.id);
        if (error) throw error;
      }
      
      // Profile will be deleted automatically via cascade
      
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

  // Format the updated date
  const formattedDate = updatedAt
    ? format(new Date(updatedAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
    : null;

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
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                {isLoading ? (
                  <Skeleton className="h-24 w-24 rounded-full" />
                ) : (
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={form.getValues("fullName")} />
                    ) : (
                      avatar ? (
                        <AvatarImage src={avatar} alt={form.getValues("fullName")} />
                      ) : (
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                          {form.getValues("fullName") ? getInitials(form.getValues("fullName")) : <User />}
                        </AvatarFallback>
                      )
                    )}
                  </Avatar>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <label htmlFor="avatar-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      disabled={isLoading || isSaving}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar foto
                    </Button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                      disabled={isLoading || isSaving}
                    />
                  </label>
                  
                  {(avatar || avatarPreview) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      disabled={isLoading || isSaving}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Name and Badges */}
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-2xl mb-2">
                  {isLoading ? (
                    <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                  ) : (
                    form.getValues("fullName") || "Sem nome"
                  )}
                </CardTitle>
                
                <CardDescription className="mb-4">
                  {email || "Sem email cadastrado"}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </>
                  ) : (
                    <>
                      <Badge variant={currentUser.profileType === "broker" ? "default" : "secondary"}>
                        {currentUser.profileType === "broker" ? "Despachante" : "Importador"}
                      </Badge>
                      
                      <Badge variant="outline">
                        {currentUser.personType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                      </Badge>
                    </>
                  )}
                </div>
                
                {formattedDate && (
                  <p className="text-xs text-gray-500 mt-4">
                    Última atualização: {formattedDate}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <Card className="shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Informações Pessoais</CardTitle>
                <CardDescription>
                  Seus dados principais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {currentUser.personType === "PF" ? "Nome Completo" : "Nome da Empresa"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="documentNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {currentUser.personType === "PF" ? "CPF" : "CNPJ"}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          O email não pode ser alterado
                        </p>
                      </div>
                    </div>

                    {/* Additional fields for PJ (company) */}
                    {currentUser.personType === "PJ" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="responsibleName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Responsável</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="responsibleCpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF do Responsável</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Endereço</CardTitle>
                <CardDescription>
                  Seus dados de localização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Logradouro</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isLoading || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full md:w-auto"
                        disabled={isLoading || isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Excluindo...
                          </>
                        ) : (
                          "Excluir Conta"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Sua conta será permanentemente excluída
                          e todos os seus dados serão removidos dos nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Sim, excluir minha conta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
import { User, Loader, Upload, Trash } from "lucide-react";

const ProfilePage = () => {
  const { currentUser, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  
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
        // User data is already in the context
        setFullName(currentUser.fullName || currentUser.companyName || "");
        setEmail(currentUser.email || "");
        
        // Get updated_at from profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("updated_at")
          .eq("id", currentUser.id)
          .single();
          
        if (!error && data) {
          setUpdatedAt(data.updated_at);
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
        console.error("Error loading user data:", error);
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
  const handleSaveProfile = async () => {
    if (!currentUser?.id) return;
    
    setIsSaving(true);
    try {
      // Update name in profiles table
      const updateData: Record<string, any> = {};
      
      if (currentUser.personType === "PF") {
        updateData.full_name = fullName;
      } else {
        updateData.company_name = fullName;
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
      console.error("Error saving profile:", error);
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
        console.log("No avatar to remove or error removing:", e);
      }
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente."
      });
      
      // Logout and redirect
      await logout();
      navigate("/login");
      
    } catch (error: any) {
      console.error("Error deleting account:", error);
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Seu Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              {isLoading ? (
                <Skeleton className="h-24 w-24 rounded-full" />
              ) : (
                <Avatar className="h-24 w-24 border-2 border-gray-200">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={fullName} />
                  ) : (
                    avatar ? (
                      <AvatarImage src={avatar} alt={fullName} />
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                        {fullName ? getInitials(fullName) : <User />}
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
            
            {/* Form Fields */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      O email não pode ser alterado
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tipo de conta</Label>
                      <div className="mt-1">
                        <Badge variant={currentUser.profileType === "broker" ? "default" : "secondary"}>
                          {currentUser.profileType === "broker" ? "Despachante" : "Importador"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Tipo de pessoa</Label>
                      <div className="mt-1">
                        <Badge variant="outline">
                          {currentUser.personType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {formattedDate && (
                    <p className="text-xs text-gray-500 text-right mt-4">
                      Última atualização: {formattedDate}
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              onClick={handleSaveProfile}
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
                  className="w-full"
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

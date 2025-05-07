
import { useState } from "react";
import { User, Upload, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileAvatarProps {
  userId: string | undefined;
  fullName: string;
  isLoading: boolean;
  existingAvatar: string | null;
  onAvatarChange: (file: File | null, preview: string | null) => void;
}

export const ProfileAvatar = ({
  userId,
  fullName,
  isLoading,
  existingAvatar,
  onAvatarChange,
}: ProfileAvatarProps) => {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      onAvatarChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Imagem selecionada",
      description: "Clique em Salvar Alterações para atualizar sua foto."
    });
  };
  
  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    onAvatarChange(null, null);
    
    toast({
      title: "Imagem removida",
      description: "Clique em Salvar Alterações para confirmar."
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isLoading ? (
        <Skeleton className="h-24 w-24 rounded-full" />
      ) : (
        <Avatar className="h-24 w-24 border-2 border-gray-200">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} alt={fullName} />
          ) : (
            existingAvatar ? (
              <AvatarImage src={existingAvatar} alt={fullName} />
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </label>
        
        {(existingAvatar || avatarPreview) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isLoading}
          >
            <Trash className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
};

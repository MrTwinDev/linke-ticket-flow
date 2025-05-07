
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  isLoading: boolean;
  currentUser: any;
  fullName: string;
  email: string;
  updatedAt: string | null;
  avatar: string | null;
  onAvatarChange: (file: File | null, preview: string | null) => void;
}

export const ProfileHeader = ({
  isLoading,
  currentUser,
  fullName,
  email,
  updatedAt,
  avatar,
  onAvatarChange,
}: ProfileHeaderProps) => {
  const { toast } = useToast();

  // Format the updated date
  const formattedDate = updatedAt
    ? format(new Date(updatedAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
    : null;
    
  // Copy email to clipboard
  const handleCopyEmail = () => {
    if (!email) return;
    
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copiado!",
      description: "O email foi copiado para a área de transferência."
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <ProfileAvatar 
            userId={currentUser?.id}
            fullName={fullName}
            isLoading={isLoading}
            existingAvatar={avatar}
            onAvatarChange={onAvatarChange}
          />
          
          {/* Name and Badges */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              {isLoading ? (
                <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              ) : (
                fullName || "Sem nome"
              )}
            </h2>
            
            <div className="flex items-center justify-center md:justify-start mb-4 text-gray-500">
              <span>{email || "Sem email cadastrado"}</span>
              {email && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="ml-1 h-6 w-6 p-0" 
                  onClick={handleCopyEmail}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copiar email</span>
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </>
              ) : (
                <>
                  <Badge variant={currentUser?.profileType === "broker" ? "default" : "secondary"}>
                    {currentUser?.profileType === "broker" ? "Despachante" : "Importador"}
                  </Badge>
                  
                  <Badge variant="outline">
                    {currentUser?.personType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
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
  );
};

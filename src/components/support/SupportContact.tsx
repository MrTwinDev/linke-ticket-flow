
import { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SupportContact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("suporte@example.com");
    setCopied(true);
    toast.success("Email copiado para a área de transferência");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contato & Chat
        </CardTitle>
        <CardDescription>
          Precisa de mais ajuda? Fale diretamente com a gente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <p><strong>Email:</strong> suporte@example.com</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={copyEmail}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copiar email</span>
            </Button>
          </div>
          <p><strong>Atendimento:</strong> Seg–Sex, 9h–18h</p>
        </div>
        <Button disabled className="w-full">Abrir Chat</Button>
      </CardContent>
    </Card>
  );
};

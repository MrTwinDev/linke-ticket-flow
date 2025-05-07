
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, User, MessageSquare, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const Support = () => {
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
    <div className="container max-w-4xl py-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
        <p className="text-muted-foreground">
          Obtenha ajuda e suporte para usar nossa plataforma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Help & FAQ Section */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Ajuda & FAQ
            </CardTitle>
            <CardDescription>
              Encontre respostas para as dúvidas mais comuns sobre como utilizar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Como criar um ticket?</AccordionTrigger>
                <AccordionContent>
                  Para criar um ticket, navegue até a seção "Tickets" no menu lateral, 
                  depois clique no botão "Criar Ticket". Preencha todos os campos 
                  obrigatórios e clique em "Enviar". Seu ticket será registrado e 
                  encaminhado para nossa equipe de suporte.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Como visualizar ou responder a um ticket?</AccordionTrigger>
                <AccordionContent>
                  Acesse a seção "Tickets" no menu lateral. Você verá uma lista de todos 
                  os seus tickets. Clique no ticket desejado para ver detalhes e histórico 
                  completo. Para responder, use o campo de texto na parte inferior e clique 
                  em "Enviar Resposta".
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Como excluir minha conta?</AccordionTrigger>
                <AccordionContent>
                  Para excluir sua conta, acesse seu perfil clicando em "Perfil" no menu 
                  lateral. Na parte inferior da página, você encontrará a opção "Excluir Conta". 
                  Confirme sua decisão no diálogo exibido. Atenção: essa ação é irreversível 
                  e todos os seus dados serão apagados permanentemente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Como atualizar minhas informações de contato?</AccordionTrigger>
                <AccordionContent>
                  Para atualizar suas informações de contato, acesse a página de perfil 
                  através do menu lateral. Lá você poderá editar seus dados pessoais, incluindo 
                  nome, endereço e telefone. Após fazer as alterações necessárias, clique em 
                  "Salvar Alterações" para confirmar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Como redefinir minha senha?</AccordionTrigger>
                <AccordionContent>
                  Se você estiver logado, pode redefinir sua senha através da página de perfil. 
                  Caso não consiga acessar sua conta, utilize a opção "Esqueci minha senha" na 
                  tela de login. Um email será enviado com instruções para redefinir sua senha.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact & Chat Section */}
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

        {/* Profile Access Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Seu Perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações ou gerencie sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/dashboard/profile">Ir para o Perfil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;

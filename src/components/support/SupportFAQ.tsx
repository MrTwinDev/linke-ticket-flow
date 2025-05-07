
import { HelpCircle } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SupportFAQ = () => {
  return (
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
  );
};

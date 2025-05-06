
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, User, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
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
        <Card className="md:col-span-1">
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
            <Button asChild className="w-full">
              <Link to="/dashboard/faq">Ver FAQ</Link>
            </Button>
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
              <p><strong>Email:</strong> suporte@example.com</p>
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

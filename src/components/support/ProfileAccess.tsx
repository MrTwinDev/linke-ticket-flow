
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const ProfileAccess = () => {
  return (
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
  );
};

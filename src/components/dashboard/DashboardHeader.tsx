
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardHeader() {
  const { currentUser, profileType } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel</h1>
        <p className="text-gray-600">
          Bem-vindo de volta, {profileType === "importer" 
            ? currentUser?.fullName || currentUser?.companyName 
            : currentUser?.fullName}
        </p>
      </div>

      {profileType === "importer" && (
        <Link to="/dashboard/tickets/create">
          <Button className="mt-4 md:mt-0">
            Criar Novo Ticket
          </Button>
        </Link>
      )}
    </div>
  );
}

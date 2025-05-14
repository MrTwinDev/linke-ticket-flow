
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, onLogout }: MobileMenuProps) => {
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="pt-2 pb-3 space-y-1 px-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center py-2">
              <Bell size={18} className="mr-2" />
              <span>Notificações</span>
            </div>
            <Button variant="outline" className="w-full" onClick={onLogout}>
              Sair
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="block">
              <Button variant="ghost" className="w-full text-foreground">Entrar</Button>
            </Link>
            <Link to="/register" className="block">
              <Button className="w-full">Registrar</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

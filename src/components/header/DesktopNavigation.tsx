
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopNavigationProps {
  onLogout: () => void;
}

const DesktopNavigation = ({ onLogout }: DesktopNavigationProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      {isAuthenticated ? (
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="outline" onClick={onLogout}>Sair</Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button>Registrar</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;

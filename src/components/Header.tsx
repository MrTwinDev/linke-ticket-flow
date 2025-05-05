
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenu from "./header/MobileMenu";
import DesktopNavigation from "./header/DesktopNavigation";
import Logo from "./header/Logo";
import MobileMenuToggle from "./header/MobileMenuToggle";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="mr-2 p-2 rounded-md text-gray-500 lg:hidden hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
            )}
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation onLogout={handleLogout} />

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <MobileMenuToggle 
              isOpen={mobileMenuOpen} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onLogout={handleLogout} />
    </header>
  );
};

export default Header;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { isAuthenticated, logout } = useAuth();
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
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-linkeblue-600 font-bold text-xl">
                LinkeImport
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center py-2">
                  <Bell size={18} className="mr-2" />
                  <span>Notifications</span>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

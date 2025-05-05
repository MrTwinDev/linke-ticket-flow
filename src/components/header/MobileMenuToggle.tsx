
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuToggle = ({ isOpen, onClick }: MobileMenuToggleProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default MobileMenuToggle;

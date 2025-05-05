
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 transition-margin lg:ml-64">
          <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;

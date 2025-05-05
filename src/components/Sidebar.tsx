
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Inbox, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const { profileType } = useAuth();
  
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <span className="text-xl font-semibold text-linkeblue-600">LinkeImport</span>
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Main Navigation
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-linkeblue-50 text-linkeblue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <Home size={18} className="mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/tickets"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-linkeblue-50 text-linkeblue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <Inbox size={18} className="mr-2" />
              Tickets
            </NavLink>
            
            {profileType === "importer" && (
              <NavLink
                to="/dashboard/tickets/create"
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-linkeblue-50 text-linkeblue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <FileText size={18} className="mr-2" />
                Create Ticket
              </NavLink>
            )}
          </nav>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-linkeblue-600 flex items-center justify-center text-white font-medium">
              {profileType === "importer" ? "I" : "B"}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {profileType === "importer" ? "Importer" : "Broker"} Account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

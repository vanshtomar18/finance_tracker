import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";


const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeMenu={activeMenu} 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {user && (
        <div className="flex">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'w-0 lg:w-16' : 'w-64'
          } flex-shrink-0`}>
            <SideMenu 
              activeMenu={activeMenu} 
              collapsed={sidebarCollapsed} 
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 transition-all duration-300 ease-in-out">
            <div className="p-5">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

import React, { useContext, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import ProfileUpdateModal from "../Modal/ProfileUpdateModal";

const SideMenu= ({activeMenu, collapsed}) =>{
    const {user,clearUser}= useContext(UserContext);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const navigate = useNavigate();

    // Debug logging
    console.log("SideMenu - User object:", user);
    console.log("SideMenu - Profile image URL:", user?.profileImageUrl);

    const handleClick=(route)=>{
        if(route === "logout"){
            handleLogout();
            return ;
        }

        navigate(route);
    }
    const handleLogout=()=>{
        localStorage.clear();
        clearUser();
        navigate("/login");
    };
    
    return (
    <div className={`${
        collapsed ? 'w-0 lg:w-16' : 'w-64'
    } h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 transition-all duration-300 overflow-hidden`}>
        
        {/* User Profile Section */}
        <div className={`flex flex-col items-center justify-center gap-3 mt-3 mb-7 ${
            collapsed ? 'lg:flex hidden' : 'flex'
        } transition-all duration-300`}>
            <div 
                className="cursor-pointer group relative"
                onClick={() => setShowProfileModal(true)}
                title="Click to update profile picture"
            >
                {user?.profileImageUrl ? (
                    <div className="relative">
                        <img
                        src={user.profileImageUrl}
                        alt="profile Image"
                        className={`rounded-full object-cover transition-opacity group-hover:opacity-80 border-2 border-gray-200 ${
                            collapsed ? 'w-10 h-10 lg:block hidden' : 'w-20 h-20'
                        }`}
                        onError={(e) => {
                            console.error("Profile image failed to load:", user.profileImageUrl);
                            // Hide the broken image and force fallback
                            e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                            console.log("Profile image loaded successfully:", user.profileImageUrl);
                        }}
                        />
                        {!collapsed && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200">
                                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">Edit</span>
                            </div>
                        )}
                    </div>
                ) : ( 
                    <div className="relative">
                        <div className={`${
                            collapsed ? 'w-10 h-10 text-sm lg:flex hidden' : 'w-20 h-20 text-xl flex'
                        } items-center justify-center rounded-full text-white font-medium bg-purple-500`}>
                            {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                        {!collapsed && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200">
                                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">Add Photo</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!collapsed && (
                <h5 className="text-gray-950 font-medium leading-6 text-center">
                    {user?.fullName || ""}
                </h5>
            )}
        </div>
        
        {/* Menu Items */}
        <div className={`px-2 ${collapsed ? 'lg:block hidden' : 'block'}`}>
            {SIDE_MENU_DATA.map((item,index)=>(
            <button
                key={`menu_${index}`}
                className={`w-full flex items-center gap-4 text-[15px] ${
                    activeMenu == item.label ? "text-white bg-primary" : "hover:bg-gray-100"
                } py-3 px-4 rounded-lg mb-3 transition-colors duration-200 ${
                    collapsed ? 'lg:justify-center lg:px-0' : 'justify-start'
                }`}
                onClick={() => handleClick(item.path)}
                title={collapsed ? item.label : ''}
                >
                <item.icon className="text-xl flex-shrink-0" />
                {!collapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                )}
                 </button>
               ))}
        </div>
        
        {/* Profile Update Modal */}
        <ProfileUpdateModal 
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
        />
      </div>
    );
}

export default SideMenu;
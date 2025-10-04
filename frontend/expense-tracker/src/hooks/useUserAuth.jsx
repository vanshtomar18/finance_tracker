import { useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import {UserContext} from "../context/userContext";
import { useNavigate} from "react-router-dom"; 
import { API_PATHS} from "../utils/apiPaths";

export const useUserAuth = () => {
    const {user, updateUser, clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already loaded, don't fetch again
        if(user) return;

        // Check if token exists in localStorage
        const token = localStorage.getItem("token");
        if(!token) {
            clearUser();
            navigate("/login");
            return;
        }

        let isMounted = true;

        const fetchUserInfo = async()=>{
            try{
                console.log("Fetching user info...");
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                
                console.log("User info response:", response.data);
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                console.error("Failed to fetch user info:",error);
                if(isMounted){
                    // Remove invalid token
                    localStorage.removeItem("token");
                    clearUser();
                    navigate("/login");
                }
            }
        };
        
        fetchUserInfo();
        
        return () => {
            isMounted = false;
        };
    },[user, updateUser, clearUser, navigate]);
};
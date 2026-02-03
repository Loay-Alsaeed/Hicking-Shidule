import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        getAllNotification();
      }, [user]);

    const getAllNotification = async () => {
        setLoading(true);
        if (!user) return;
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${baseUrl}/api/notification/getallnotification/${user.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                const result = await response.json();
                notifyError(result.message);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNotification(data);
            console.log(data);
        } catch (error) {
            console.error("Error getting all notification:", error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <NotificationContext.Provider value={{ loading,notification, setNotification, getAllNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificatin = () => useContext(NotificationContext);
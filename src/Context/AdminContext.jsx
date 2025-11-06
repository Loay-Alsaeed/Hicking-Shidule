import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        getAllEmployees();
      }, [user]);

    const getAllEmployees = async () => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${baseUrl}/api/admin/getallemployee`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${user.user.token}`,
                },
            });
            if (!response.ok) {
                const result = await response.json();
                notifyError(result.message);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEmployees(data);
            // console.log(data);
        } catch (error) {
            console.error("Error getting all employees:", error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <AdminContext.Provider value={{ user, loading, getAllEmployees }}>
            {children}
        </AdminContext.Provider>
    );
};
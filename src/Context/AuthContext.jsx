import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("Hicking_User"));
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const Adminlogin = async (credentials) => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/admin/login`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          const text = await response.text().catch(() => "");
          if (text) errorMessage = text;
        }
  
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      setUser(data);
      localStorage.setItem("Hicking_User", JSON.stringify(data));
      return true;
  
    } catch (err) {
      console.error("Login error:", err.message);
      return err.message;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/customer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {

        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          const text = await response.text().catch(() => "");
          if (text) errorMessage = text;
        }
  
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      setUser(data);
      localStorage.setItem("Hicking_User", JSON.stringify(data));
      return true;
  
    } catch (err) {
      console.error("Login error:", err.message);
      return err.message;
    } finally {
      setLoading(false);
    }
  };
  

  const register = async (userData) => {
    setLoading(true);
    try {
        const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

    //   const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        // if (contentType.includes("application/json")) {
        //   const errJson = await response.json().catch(() => null);
        //   const message = (errJson && (errJson.message || errJson.error)) || "Register failed";
        //   throw new Error(message);
        // }
        throw new Error(message);
        // const text = await response.text().catch(() => "");
        // throw new Error(text || "Register failed");
      }

      // let data = null;
      // if (contentType.includes("application/json")) {
      //   data = await response.json();
      // }
      let data = await response.json();

      // const authData = data && (data.user || data) ? (data.user || data) : { name: userData.Name, email: userData.Email };
      setUser(data);
      console.log(data);
      localStorage.setItem("Hicking_User", JSON.stringify(data));
      return true;
    } catch (err) {
      console.error("Register error:", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("Hicking_User");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, Adminlogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

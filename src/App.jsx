import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import { TripProvider } from "./Context/TripContext";
import { TripPointsProvider } from "./Context/TripPointsContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Header from "./Components/Header";
import GlobalNotifications from "./Components/GlobalNotifications";
import ShowError from "./Components/ShowError";
import "./i18n"; 
import { useTranslation } from "react-i18next";
import Notifications from "./Pages/Notification";
import { NotificationProvider } from "./Context/NotificationContext";
import NotificationDisplay from "./Components/NotificationDisplay";
import ChatTap from "./Components/ChatTap";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.body.dir = lang === "ar" ? "rtl" : "ltr"; 
  };

  return (
    <>
    <AuthProvider>
      <TripProvider>
        <TripPointsProvider>
          <NotificationProvider>
            <BrowserRouter>
                <Header />
                <GlobalNotifications />
                <ShowError />
                <Routes>
                <Route path='/' element={
                  <ProtectedRoute>
                    <NotificationDisplay/>
                    <ChatTap/>
                    <Home/>
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="notification" element={<Notifications/>}/>
                </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </TripPointsProvider>
      </TripProvider>
    </AuthProvider>
    
    </>
  );
}

export default App;

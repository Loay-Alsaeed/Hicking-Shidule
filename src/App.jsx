import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import { TripProvider } from "./Context/TripContext";
// import { AddTripProvider } from "./Context/AddTripContext";
import { TripPointsProvider } from "./Context/TripPointsContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Header from "./Components/Header";
import ShowError from "./Components/ShowError";
import "./i18n"; 
import { useTranslation } from "react-i18next";
import Map from "./Pages/map";

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

          <BrowserRouter>
              <Header />
              <ShowError />
              <Routes>
              <Route path='/' element={
                <ProtectedRoute>
                  <Home/>
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              </Routes>
          </BrowserRouter>
        </TripPointsProvider>
      </TripProvider>
    </AuthProvider>
    
    </>
  );
}

export default App;

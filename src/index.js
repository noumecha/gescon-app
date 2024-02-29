import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import { AuthProvider } from "services/AuthContext";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { useAuth } from "services/AuthContext";

function App() {

  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={ isLoggedIn ? <AdminLayout /> : <Navigate to="/auth/login"/>} />
        <Route path="/auth/*" element={ isLoggedIn ? <Navigate to="/admin/index"/> : <AuthLayout />} />
        <Route path="*" element={ isLoggedIn ? <Navigate to="/admin/index" /> : <Navigate to="/auth/login"/>} />
      </Routes>
    </BrowserRouter>
  );
}

//root.render(<App />);
//render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
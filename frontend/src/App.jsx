import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from 'react-toastify';

import Login from "./pages/Login";
import Register from "./pages/Register";
import ServiceList from "./pages/ServiceList";

function App() {
  return (
    <Router>
      <ToastContainer /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/service-list" element={<ServiceList />} />
        <Route path="*" element={<Login />} /> {/* Redireciona para login por padrão */}
      </Routes>
    </Router>
  );
}

export default App;

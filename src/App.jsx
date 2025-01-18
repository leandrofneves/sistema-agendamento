import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ToastSetup from './components/ToastSetup';
import { ToastContainer } from 'react-toastify';

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <ToastContainer /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} /> {/* Redireciona para login por padrão */}
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;

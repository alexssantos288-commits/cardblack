import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner"; // Para notificações bonitas

function App() {
  return (
    <Router>
      {/* O Toaster permite que os avisos de "Salvo com sucesso" apareçam em qualquer página */}
      <Toaster position="top-center" richColors />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
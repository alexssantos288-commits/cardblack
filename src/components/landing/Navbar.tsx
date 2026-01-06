import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Efeito para mudar a cor da Navbar ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      isScrolled ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO (Baseado na Imagem 01) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-[#1ccec8] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(28,206,200,0.3)]">
            <span className="text-black font-black text-xl">N</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase hidden sm:block">
            NFCard
          </span>
        </div>

        {/* LINKS DE NAVEGAÇÃO (Centro) */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#recursos" className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Recursos</a>
          <a href="#precos" className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Preços</a>
          <a href="#contato" className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Contato</a>
        </div>

        {/* BOTÕES DE AÇÃO (Direita) */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#1ccec8] transition-colors"
          >
            Entrar
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="h-12 px-6 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-widest text-[11px] rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            Começar grátis
          </button>
        </div>

      </div>
    </nav>
  );
};
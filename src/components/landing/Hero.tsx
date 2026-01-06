import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="z-10 text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
          Seu cartão de visita <br />
          <span className="text-[#1ccec8]">em um toque</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Crie, personalize e compartilhe seu perfil profissional com tecnologia NFC.
        </p>
        <button 
          onClick={() => navigate("/login")}
          className="h-16 px-10 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-4 mx-auto transition-all hover:scale-105"
        >
          Criar meu cartão agora
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
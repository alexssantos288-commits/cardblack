import React from "react";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em]">
          © 2024 NFCard. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <Instagram className="w-5 h-5 text-gray-600 hover:text-[#1ccec8] cursor-pointer" />
          <Linkedin className="w-5 h-5 text-gray-600 hover:text-[#1ccec8] cursor-pointer" />
          <Twitter className="w-5 h-5 text-gray-600 hover:text-[#1ccec8] cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};
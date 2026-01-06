import React from "react";
import { Smartphone, Palette, Share2, Zap, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Mobile First", desc: "Design otimizado para todos os dispositivos." },
  { icon: Palette, title: "Personalização", desc: "Cores, fontes e layouts com a sua cara." },
  { icon: Share2, title: "Compartilhe Fácil", desc: "NFC, QR Code ou link direto." },
  { icon: Zap, title: "Atualização Real", desc: "Mudou de cargo? Atualize em segundos." },
  { icon: ShieldCheck, title: "Seguro e Privado", desc: "Você controla quem vê suas informações." },
  { icon: BarChart3, title: "Analytics", desc: "Saiba quem clicou e de onde vieram." },
];

export const Features = () => {
  return (
    <section className="bg-[#050505] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-10 bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] hover:bg-[#252525] transition-all group">
              <div className="w-14 h-14 bg-[#1ccec8]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1ccec8] transition-all">
                <f.icon className="w-7 h-7 text-[#1ccec8] group-hover:text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-widest">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
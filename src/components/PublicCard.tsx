import React from "react";
import { 
  Instagram, Linkedin, Globe, DollarSign, MessageSquare, X, Copy 
} from "lucide-react";
import { UserProfile } from "../types/profile";
import { toast } from "sonner";

interface PublicCardProps {
  profile: UserProfile;
  onClose: () => void;
}

const PublicCard = ({ profile, onClose }: PublicCardProps) => {
  
  const handlePixCopy = () => {
    if (!profile.pix.key) return;
    navigator.clipboard.writeText(profile.pix.key);
    toast.success("Chave PIX copiada!");
    setTimeout(() => {
      window.location.href = "https://pix.bcb.gov.br/qr/";
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-y-auto custom-scrollbar font-sans">
      {/* BOTÃO FECHAR */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[210] bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all"
      >
        <X size={24} />
      </button>

      <div className="max-w-md mx-auto min-h-screen bg-[#050505] relative pb-20">
        
        {/* HEADER COVER */}
        <div className="h-40 w-full relative" style={{ backgroundColor: profile.themeColor + '33' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
        </div>

        {/* PERFIL */}
        <div className="px-6 -mt-20 relative text-center">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#050505] overflow-hidden shadow-2xl bg-gray-900">
            {profile.avatar ? (
              <img src={profile.avatar} className="w-full h-full object-cover" alt={profile.name} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-black" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-black text-white tracking-tight">{profile.name}</h1>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed px-4">{profile.bio}</p>
        </div>

        {/* REDES SOCIAIS */}
        <div className="px-6 mt-10 grid grid-cols-4 gap-4">
          <button className="bg-pink-600 aspect-square rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"><Instagram size={24} /></button>
          <button className="bg-green-600 aspect-square rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"><MessageSquare size={24} /></button>
          <button className="bg-blue-700 aspect-square rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"><Linkedin size={24} /></button>
          <button className="bg-purple-600 aspect-square rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"><Globe size={24} /></button>
        </div>

        {/* PIX */}
        {profile.pix.key && (
          <div className="px-6 mt-10">
            <button onClick={handlePixCopy} className="w-full bg-white text-black p-5 rounded-[24px] flex items-center justify-between group hover:bg-gray-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 p-2 rounded-xl text-white"><DollarSign size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pagar via PIX</p>
                  <p className="font-bold text-sm">Copia e Cola</p>
                </div>
              </div>
              <Copy size={18} className="text-gray-400 group-hover:text-black" />
            </button>
          </div>
        )}

        {/* CATÁLOGO */}
        <div className="px-6 mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-black uppercase tracking-widest text-xs">Catálogo Digital</h2>
            <div className="h-[1px] flex-1 bg-white/10 ml-4" />
          </div>

          <div className="space-y-6">
            {profile.catalog.filter(i => !i.hidden).map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
                {/* LÓGICA DE LAYOUT INVERTIDO */}
                {item.imageAbove ? (
                  <>
                    <div className="p-6 space-y-3">
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-blue-400 font-black text-xl">{item.price}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                    </div>
                    {item.images?.[0] && (
                      <div className="w-full bg-black flex items-center justify-center">
                        <img src={item.images[0]} className="w-full h-auto object-contain" alt={item.name} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.images?.[0] && (
                      <div className="w-full bg-black flex items-center justify-center">
                        <img src={item.images[0]} className="w-full h-auto object-contain" alt={item.name} />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-blue-400 font-black text-xl">{item.price}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                    </div>
                  </>
                )}
                <div className="px-6 pb-6 pt-4">
                  <button className="w-full h-12 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                    {item.linkType === 'whatsapp' && <MessageSquare size={16} />}
                    {item.buttonText || "Mais informações"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORMULÁRIO */}
        {profile.contactForm.enabled && (
          <div className="px-6 mt-12 pb-10">
            <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 space-y-6">
              <h2 className="text-white font-black text-center uppercase tracking-widest text-xs">Fale Comigo</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Seu Nome" className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-blue-500" />
                <textarea placeholder="Sua Mensagem" className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-blue-500 resize-none" />
                <button className="w-full h-14 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl">Enviar Mensagem</button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-10 opacity-30">
          <p className="text-[10px] text-white font-bold uppercase tracking-widest">Criado por Alex Santos</p>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;
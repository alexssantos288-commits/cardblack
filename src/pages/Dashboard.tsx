import React, { useState } from "react";
import { LayoutDashboard, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";
import ProfileEditor from "../components/dashboard/ProfileEditor";
import PublicCard from "../components/PublicCard"; // IMPORTANTE
import { UserProfile } from "../types/profile";

const Dashboard = () => {
  const [showPreview, setShowPreview] = useState(false); // ESTADO DO PREVIEW
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Santos",
    bio: "Desenvolvedor Web | Especialista em Soluções Digitais",
    avatar: "",
    themeColor: "#1ccec8",
    buttonStyle: 'rounded',
    contact: {
      phone: "", whatsapp: "", email: "", website: "", instagram: "",
      twitter: "", facebook: "", linkedin: "", spotify: "", youtube: "",
      tiktok: "", location: "", googleReviews: "", address: "",
    },
    socialLinks: [],
    customLinks: [],
    linkOrder: [],
    standardLinkIconOnly: {},
    pix: { enabled: true, keyType: "cpf", key: "", name: "", city: "SAO PAULO" },
    catalog: [],
    contactForm: {
      enabled: true,
      title: "Entre em contato",
      fields: { name: true, email: true, phone: true, message: true }
    }
  });

  const handleProfileChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      
      {/* HEADER FIXO */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/5 py-6 px-6 mb-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#1ccec8]/10 p-2 rounded-lg">
              <LayoutDashboard className="text-[#1ccec8] w-6 h-6" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter">Painel de Controle</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPreview(true)} // ABRE O CARTÃO
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all"
            >
              Ver meu cartão <ExternalLink className="w-4 h-4 text-[#1ccec8]" />
            </button>
            <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <ProfileEditor 
          profile={profile} 
          onProfileChange={handleProfileChange} 
          onSave={handleSave} 
        />
      </main>

      {/* RENDERIZA O CARTÃO SE O BOTÃO FOR CLICADO */}
      {showPreview && (
        <PublicCard profile={profile} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default Dashboard;
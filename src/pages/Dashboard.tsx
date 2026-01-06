import React, { useState } from "react";
import { LayoutDashboard, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ProfileEditor from "../components/dashboard/ProfileEditor";
import { UserProfile } from "../types/profile";

const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Santos",
    bio: "Desenvolvedor Web",
    avatar: "",
    themeColor: "#1ccec8", // Campo obrigatório
    buttonStyle: "rounded", // Campo obrigatório
    contact: {
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      address: "",
    },
    socialLinks: [],
    customLinks: [],
    linkOrder: [],
    standardLinkIconOnly: {},
    pix: {
      enabled: false,
      keyType: "cpf",
      key: "",
      name: "",
      city: "",
    },
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
      <header className="bg-[#1a1a1a] border-b border-white/5 py-8 px-6 mb-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <LayoutDashboard className="text-[#1ccec8] w-8 h-8" />
              Painel
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white/5 px-5 py-3 rounded-xl text-sm font-bold uppercase">
            Ver cartão <ExternalLink className="w-4 h-4 text-[#1ccec8]" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <ProfileEditor 
          profile={profile} 
          onProfileChange={handleProfileChange} 
          onSave={handleSave} 
        />
      </main>
    </div>
  );
};

export default Dashboard;
import React from "react";
import { 
  UserCircle, 
  Share2, 
  Link as LinkIcon, 
  Palette, 
  Zap, 
  BarChart3,
  LayoutDashboard,
  ExternalLink
} from "lucide-react";
import { DashboardAccordion, AccordionSection } from "../components/dashboard/DashboardAccordion";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      
      {/* HEADER DO DASHBOARD */}
      <header className="bg-[#1a1a1a] border-b border-white/5 py-8 px-6 mb-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <LayoutDashboard className="text-[#1ccec8] w-8 h-8" />
              Painel de Controle
            </h1>
            <p className="text-gray-500 font-medium mt-1">Gerencie seu cartão de visita digital</p>
          </div>
          
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition-all text-sm font-bold uppercase tracking-widest">
            Ver meu cartão
            <ExternalLink className="w-4 h-4 text-[#1ccec8]" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* RESUMO DE ESTATÍSTICAS (Analytics Rápido) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-white/5">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total de Visitas</p>
            <p className="text-4xl font-black text-white">1.284</p>
          </div>
          <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-white/5">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Cliques em Links</p>
            <p className="text-4xl font-black text-[#1ccec8]">856</p>
          </div>
          <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-white/5">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Taxa de Conversão</p>
            <p className="text-4xl font-black text-white">67%</p>
          </div>
        </div>

        {/* OS 6 ACCORDIONS DE EDIÇÃO */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-gray-600 uppercase tracking-[0.4em] mb-8 ml-2">Configurações do Cartão</h2>
          
          <DashboardAccordion>
            
            <AccordionSection 
              value="perfil" 
              title="Meu Perfil e Bio" 
              icon={UserCircle} 
              iconColor="bg-[#1ccec8]"
            >
              <div className="text-gray-500 p-4">Aqui vamos configurar Nome, Bio e Foto de Perfil.</div>
            </AccordionSection>

            <AccordionSection 
              value="redes" 
              title="Redes Sociais" 
              icon={Share2} 
              iconColor="bg-[#facc15]"
            >
              <div className="text-gray-500 p-4">Aqui vamos adicionar Instagram, LinkedIn e WhatsApp.</div>
            </AccordionSection>

            <AccordionSection 
              value="links" 
              title="Links Personalizados" 
              icon={LinkIcon} 
              iconColor="bg-[#a855f7]"
            >
              <div className="text-gray-500 p-4">Adicione botões para seu site, portfólio ou catálogo.</div>
            </AccordionSection>

            <AccordionSection 
              value="design" 
              title="Design & Estilo" 
              icon={Palette} 
              iconColor="bg-[#ec4899]"
            >
              <div className="text-gray-500 p-4">Mude as cores, fontes e o formato dos botões.</div>
            </AccordionSection>

            <AccordionSection 
              value="nfc" 
              title="Configurações NFC/QR" 
              icon={Zap} 
              iconColor="bg-[#f97316]"
            >
              <div className="text-gray-500 p-4">Gerencie seu chip NFC e baixe seu QR Code.</div>
            </AccordionSection>

            <AccordionSection 
              value="analytics" 
              title="Relatórios Detalhados" 
              icon={BarChart3} 
              iconColor="bg-[#22c55e]"
            >
              <div className="text-gray-500 p-4">Veja de quais cidades e dispositivos seus clientes vêm.</div>
            </AccordionSection>

          </DashboardAccordion>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
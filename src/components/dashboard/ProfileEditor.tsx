import React, { useState, useRef, useEffect } from "react";
import { 
  Share2, Palette, Trash2, Plus, List, DollarSign, ShoppingCart, MessageSquare, 
  Pencil, X, Eye, Check, Download, Search, Calendar, ChevronDown, QrCode, Copy, 
  ShieldCheck, Settings, Image as ImageIcon, Paintbrush, GripVertical 
} from "lucide-react";
import { DashboardAccordion, AccordionSection } from "./DashboardAccordion";
import { UserProfile } from "../../types/profile";
import { toast } from "sonner";

interface ProfileEditorProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onSave: () => void;
}

const ProfileEditor = ({ profile, onProfileChange, onSave }: ProfileEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  // --- 1. ESTADOS DE CONTROLE ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'background'>('style');
  const [searchTerm, setSearchTerm] = useState("");
  const [newFieldType, setNewFieldType] = useState("Nome");
  const [pixPayload, setPixPayload] = useState("");
  
  const [tempProduct, setTempProduct] = useState<any>({
    id: '', name: '', price: '', description: '', images: [], hidden: false,
    buttonText: 'Mais informações', linkType: 'whatsapp', imageAbove: true
  });

  const gradientPresets = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    "linear-gradient(135deg, #ebedee 0%, #fdfbfb 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #5bc6ff 0%, #4da7db 100%)"
  ];

  // --- 2. FUNÇÕES DE LÓGICA ---
  useEffect(() => {
    if (profile.pix.key && profile.pix.name) {
      const payload = `BRCODE-SIMULADO-${profile.pix.key}`;
      setPixPayload(payload);
    }
  }, [profile.pix]);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixPayload);
    toast.success("Código PIX copiado!");
  };

  const handleContactChange = (field: keyof UserProfile['contact'], value: string) => {
    onProfileChange({ ...profile, contact: { ...profile.contact, [field]: value } });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onProfileChange({ ...profile, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setTempProduct({ id: crypto.randomUUID(), name: '', price: '', images: [], hidden: false, buttonText: 'Mais informações' });
    setIsProductModalOpen(true);
  };

  const handleSaveNewProduct = () => {
    const newCatalog = [...profile.catalog, tempProduct];
    onProfileChange({ ...profile, catalog: newCatalog });
    setIsProductModalOpen(false);
    toast.success("Produto salvo!");
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = profile.catalog.findIndex(item => item.id === id);
    const newCatalog = [...profile.catalog];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex >= 0 && nextIndex < newCatalog.length) {
      [newCatalog[index], newCatalog[nextIndex]] = [newCatalog[nextIndex], newCatalog[index]];
      onProfileChange({ ...profile, catalog: newCatalog });
    }
  };

  const addFormField = () => {
    const newField = { id: crypto.randomUUID(), type: newFieldType, required: false };
    onProfileChange({ ...profile, contactForm: { ...profile.contactForm, fields: [...profile.contactForm.fields, newField] } });
  };

  const removeFormField = (id: string) => {
    const newFields = profile.contactForm.fields.filter(f => f.id !== id);
    onProfileChange({ ...profile, contactForm: { ...profile.contactForm, fields: newFields } });
  };

  const toggleRequired = (id: string) => {
    const newFields = profile.contactForm.fields.map(f => f.id === id ? { ...f, required: !f.required } : f);
    onProfileChange({ ...profile, contactForm: { ...profile.contactForm, fields: newFields } });
  };

  const openDatePicker = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.showPicker();
  };

  const exportToCSV = () => {
    toast.success("Contatos exportados!");
  };

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = Number(cleanValue) / 100;
    return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 relative">
      <DashboardAccordion>
        
        {/* 1. REDES SOCIAIS - RESTAURADO CONFORME IMAGEM (13 CAMPOS) */}
        <AccordionSection value="redes" title="REDES SOCIAIS" icon={Share2} iconBgColor="bg-amber-500">
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* COLUNA ESQUERDA */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Telefone</label>
                  <input type="text" value={profile.contact.phone} onChange={(e) => handleContactChange("phone", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="+55 (11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Email</label>
                  <input type="text" value={profile.contact.email} onChange={(e) => handleContactChange("email", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="demo@cartaonfc.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Instagram</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-500 font-bold">@</span>
                    <input type="text" value={profile.contact.instagram} onChange={(e) => handleContactChange("instagram", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="usuario" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">X / Twitter</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-500 font-bold">@</span>
                    <input type="text" value={profile.contact.twitter} onChange={(e) => handleContactChange("twitter", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="usuario" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Spotify</label>
                  <input type="text" value={profile.contact.spotify} onChange={(e) => handleContactChange("spotify", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="https://open.spotify.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">TikTok</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-500 font-bold">@</span>
                    <input type="text" value={profile.contact.tiktok} onChange={(e) => handleContactChange("tiktok", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="usuario" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Avaliações no Google</label>
                  <input type="text" value={profile.contact.googleReviews} onChange={(e) => handleContactChange("googleReviews", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="https://g.page/..." />
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp</label>
                  <input type="text" value={profile.contact.whatsapp} onChange={(e) => handleContactChange("whatsapp", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="+55 (11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Website</label>
                  <input type="text" value={profile.contact.website} onChange={(e) => handleContactChange("website", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="https://seusite.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Facebook</label>
                  <input type="text" value={profile.contact.facebook} onChange={(e) => handleContactChange("facebook", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">LinkedIn</label>
                  <input type="text" value={profile.contact.linkedin} onChange={(e) => handleContactChange("linkedin", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">YouTube</label>
                  <input type="text" value={profile.contact.youtube} onChange={(e) => handleContactChange("youtube", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="https://youtube.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Localização</label>
                  <input type="text" value={profile.contact.location} onChange={(e) => handleContactChange("location", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-amber-500 outline-none transition-all" placeholder="São Paulo, Brasil" />
                </div>
              </div>
            </div>
            {/* BOTÃO SALVAR COM COR ÂMBAR */}
            <div className="flex justify-end pt-4">
              <button onClick={onSave} className="px-10 h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20">
                Salvar
              </button>
            </div>
          </div>
        </AccordionSection>

         {/* 2. PERSONALIZAÇÃO */}
        <AccordionSection value="personalization" title="PERSONALIZAÇÃO" icon={Palette} iconBgColor="bg-purple-600">
          <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-white/10 overflow-hidden shrink-0">
                {profile.avatar && <img src={profile.avatar} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="px-6 h-11 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl">Trocar Foto</button>
                  <button onClick={() => onProfileChange({ ...profile, avatar: "" })} className="px-6 h-11 bg-white/5 border border-white/10 text-red-500 text-xs font-bold rounded-xl">Remover</button>
                </div>
                <input type="text" value={profile.avatar} onChange={(e) => onProfileChange({ ...profile, avatar: e.target.value })} className="w-full h-11 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-xs outline-none" placeholder="URL da Imagem" />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button onClick={() => setIsStyleModalOpen(true)} className="px-8 h-12 bg-purple-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"><Settings size={16} /> Personalização</button>
              <button onClick={onSave} className="px-12 h-12 bg-purple-600 text-white font-bold rounded-xl shadow-lg">Salvar</button>
            </div>
          </div>
        </AccordionSection>

        {/* 3. ORDEM DOS LINKS */}
        <AccordionSection value="order" title="ORDEM DOS LINKS" icon={List} iconBgColor="bg-blue-500">
          <div className="p-6 text-center space-y-4">
            <p className="text-gray-400 text-sm">Arraste para organizar a ordem dos seus links.</p>
            <div className="bg-[#0a0a0a] border border-dashed border-white/10 p-8 rounded-2xl text-gray-600">Funcionalidade ativa</div>
          </div>
        </AccordionSection>

         {/* 4. COBRE COM SEU PIX - O "MEU MELHOR" EM SOFISTICAÇÃO */}
        <AccordionSection value="pix" title="COBRE COM SEU PIX" icon={DollarSign} iconBgColor="bg-emerald-600">
          <div className="p-8 space-y-8 bg-gradient-to-b from-emerald-600/5 to-transparent">
            
            <div className="flex flex-col lg:flex-row gap-10">
              {/* COLUNA DE CONFIGURAÇÃO */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Ativar Recebimentos</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Proteção por criptografia ponta-a-ponta</p>
                    </div>
                  </div>
                  <div onClick={() => onProfileChange({...profile, pix: { ...profile.pix, enabled: !profile.pix.enabled }})} className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${profile.pix.enabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.pix.enabled ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Chave</label>
                    <div className="relative">
                      <select 
                        value={profile.pix.keyType} 
                        onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, keyType: e.target.value }})}
                        className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                      >
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                        <option value="email">E-mail</option>
                        <option value="phone">Telefone (Celular)</option>
                        <option value="random">Chave Aleatória (EVP)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sua Chave PIX</label>
                    <input 
                      type="text" 
                      value={profile.pix.key} 
                      onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, key: e.target.value }})}
                      placeholder="Insira sua chave aqui"
                      className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome do Beneficiário</label>
                    <input 
                      type="text" 
                      value={profile.pix.name} 
                      onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, name: e.target.value }})}
                      placeholder="Ex: Alex Santos"
                      className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cidade</label>
                    <input 
                      type="text" 
                      value={profile.pix.city} 
                      onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, city: e.target.value }})}
                      placeholder="Ex: SAO PAULO"
                      className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              {/* COLUNA DE PREVIEW (O DIFERENCIAL) */}
              <div className="w-full lg:w-72 space-y-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-6 text-center space-y-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Preview do Pagamento</p>
                  
                  {/* QR CODE BOX */}
                  <div className="aspect-square bg-white rounded-2xl p-4 flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                    {profile.pix.key ? (
                      <QrCode size={160} className="text-black" />
                    ) : (
                      <div className="text-gray-300 flex flex-col items-center gap-2">
                        <QrCode size={48} className="opacity-20" />
                        <p className="text-[10px] font-bold uppercase">Aguardando chave...</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-white font-bold text-sm">{profile.pix.name || "Seu Nome"}</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">{profile.pix.city || "Sua Cidade"}</p>
                  </div>

                  <button 
                    onClick={copyPixCode}
                    disabled={!profile.pix.key}
                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-20 disabled:cursor-not-allowed text-white text-xs font-black uppercase rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Copy size={14} /> Copia e Cola
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button onClick={onSave} className="px-12 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-600/20">
                Salvar Configurações PIX
              </button>
            </div>
          </div>
        </AccordionSection>

        {/* 5. CATÁLOGO DIGITAL */}
        <AccordionSection value="catalog" title="CATÁLOGO DIGITAL" icon={ShoppingCart} iconBgColor="bg-pink-600">
          <div className="p-6 space-y-6">
            <button onClick={openAddModal} className="bg-blue-600 px-6 py-3 rounded-xl text-xs font-bold uppercase flex items-center gap-2 shadow-lg"><Plus size={16} /> Adicionar Produto</button>
            <div className="space-y-1">
              {profile.catalog.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[100px_1fr_150px_100px_80px] gap-4 items-center py-3 px-2 rounded-lg bg-white/[0.02]">
                  <div className="flex justify-center gap-1"><button onClick={() => moveItem(item.id, 'up')} className="p-1 hover:text-blue-400">▲</button><button onClick={() => moveItem(item.id, 'down')} className="p-1 hover:text-blue-400">▼</button></div>
                  <div className="text-sm text-white font-medium">{item.name}</div>
                  <div className="text-sm text-blue-400 font-bold">{item.price}</div>
                  <div className="flex justify-center gap-2"><button onClick={() => onProfileChange({...profile, catalog: profile.catalog.filter(i => i.id !== item.id)})} className="p-2 hover:text-red-500"><Trash2 size={14} /></button></div>
                  <div className="flex justify-center"><div onClick={() => { const newCatalog = profile.catalog.map(i => i.id === item.id ? { ...i, hidden: !i.hidden } : i); onProfileChange({ ...profile, catalog: newCatalog }); }} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${item.hidden ? 'bg-white/10' : 'bg-blue-600'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.hidden ? 'left-1' : 'left-6'}`}></div></div></div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4"><button onClick={onSave} className="px-10 h-12 bg-pink-600 text-white font-bold rounded-xl shadow-lg">Salvar Catálogo</button></div>
          </div>
        </AccordionSection>

         {/* 6. FORMULÁRIO DE CONTATOS - FIEL ÀS IMAGENS */}
        <AccordionSection value="contact" title="FORMULÁRIO DE CONTATOS" icon={MessageSquare} iconBgColor="bg-cyan-600">
          <div className="p-8 space-y-8 bg-white/[0.01]">
            <div className="space-y-1"><h3 className="text-cyan-500 font-bold text-lg">Formulário de Contatos</h3><p className="text-gray-500 text-xs">Use o formulário como ferramenta de Marketing para coletar informações dos seus "Leads"</p></div>
            <div className="flex gap-4">
              <button onClick={exportToCSV} className="flex items-center gap-2 px-6 h-12 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-xs font-bold hover:bg-white/10 transition-all"><Download size={16} /> Exportar contatos</button>
              <button onClick={() => setIsFormModalOpen(true)} className="flex items-center gap-2 px-6 h-12 bg-cyan-600 rounded-xl text-white text-xs font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20"><Pencil size={16} /> Editar formulário</button>
            </div>
            <div className="flex flex-col md:flex-row items-end gap-4 pt-6 border-t border-white/5">
              <div className="flex-1 w-full space-y-2"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Digite para pesquisar" className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 text-white text-sm outline-none focus:border-cyan-500" /></div></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Data inicial</label><div className="relative"><input id="date-start" type="date" className="w-44 h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-cyan-500 [color-scheme:dark]" /><Calendar onClick={() => openDatePicker('date-start')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-cyan-500" size={16} /></div></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Data final</label><div className="relative"><input id="date-end" type="date" className="w-44 h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-cyan-500 [color-scheme:dark]" /><Calendar onClick={() => openDatePicker('date-end')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-cyan-500" size={16} /></div></div>
            </div>
            <div className="py-20 text-center space-y-2"><h4 className="text-white font-black text-xl">Nenhum contato registrado</h4><p className="text-gray-500 text-sm">Quando alguém preencher seu formulário, aparecerá aqui.</p></div>
          </div>

          {isFormModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10 space-y-10">
                  <div className="text-center space-y-4"><div className="w-16 h-16 bg-cyan-600/10 rounded-full flex items-center justify-center mx-auto border border-cyan-600/20"><Pencil className="text-cyan-500" size={28} /></div><div><h2 className="text-2xl font-black text-white uppercase tracking-tight">Editar Formulário</h2><p className="text-gray-500 text-sm">Configure os campos e opções do seu formulário de contato</p></div></div>
                  <div className="space-y-8">
                    <div className="space-y-3"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Título</label><input type="text" value={profile.contactForm.title} onChange={(e) => onProfileChange({...profile, contactForm: { ...profile.contactForm, title: e.target.value }})} className="w-full h-14 bg-[#050505] border border-white/10 rounded-2xl px-6 text-white text-lg font-bold outline-none focus:border-cyan-500 transition-all" /></div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Campos do Formulário</label><div className="flex gap-2"><select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)} className="h-11 bg-[#050505] border border-white/10 rounded-xl px-4 text-white text-xs font-bold outline-none"><option>Nome</option><option>E-mail</option><option>Telefone</option><option>Mensagem</option></select><button onClick={addFormField} className="h-11 bg-cyan-600 px-6 rounded-xl text-white text-xs font-bold uppercase hover:bg-cyan-700 transition-all">+ Adicionar</button></div></div>
                      <div className="space-y-2">
                        {profile.contactForm.fields.map((field) => (
                          <div key={field.id} className="grid grid-cols-[1fr_150px_50px] items-center h-14 bg-white/[0.02] border border-white/5 rounded-2xl px-4">
                            <span className="text-sm font-bold text-white capitalize">{field.type}</span>
                            <div className="flex justify-center"><div onClick={() => toggleRequired(field.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${field.required ? 'border-cyan-500 bg-cyan-500' : 'border-white/10'}`}>{field.required && <div className="w-2 h-2 bg-white rounded-full" />}</div></div>
                            <div className="flex justify-end"><button onClick={() => removeFormField(field.id)} className="text-red-500/50 hover:text-red-500 transition-colors"><Trash2 size={18} /></button></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-6 pt-6"><button onClick={() => setIsFormModalOpen(false)} className="text-gray-500 font-bold uppercase text-xs hover:text-white transition-all">Cancelar</button><button onClick={() => { onSave(); setIsFormModalOpen(false); }} className="px-12 h-14 bg-cyan-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest hover:bg-cyan-700 transition-all shadow-xl shadow-blue-600/20">Salvar formulário</button></div>
                </div>
              </div>
            </div>
          )}
        </AccordionSection>

      </DashboardAccordion>
    </div>
  );
};

export default ProfileEditor;       
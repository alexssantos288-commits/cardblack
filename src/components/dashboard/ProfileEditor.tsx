import React, { useState, useRef } from "react";
import { 
  Share2, Palette, Trash2, Plus, List, DollarSign, ShoppingCart, MessageSquare, Pencil, X
} from "lucide-react";
import { DashboardAccordion, AccordionSection } from "./DashboardAccordion";
import { UserProfile, CatalogItem } from "../../types/profile";
import { toast } from "sonner";

interface ProfileEditorProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onSave: () => void;
}

const ProfileEditor = ({ profile, onProfileChange, onSave }: ProfileEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS DE CONTROLE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Estado do Produto Temporário
  const [tempProduct, setTempProduct] = useState<any>({
    id: '', 
    name: '', 
    price: '', 
    description: '', 
    images: [], 
    hidden: false,
    buttonText: 'Mais informações',
    linkType: 'whatsapp',
    imageAbove: true
  });

  // --- FUNÇÕES AUXILIARES ---

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = Number(cleanValue) / 100;
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    onProfileChange({ ...profile, [field]: value });
  };

  const handleContactChange = (field: keyof UserProfile['contact'], value: string) => {
    onProfileChange({
      ...profile,
      contact: { ...profile.contact, [field]: value }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfileChange({ ...profile, avatar: reader.result as string });
        toast.success("Foto carregada!");
      };
      reader.readAsDataURL(file);
    }
  };

  // --- LÓGICA DO CATÁLOGO ---

  const openAddModal = () => {
    setTempProduct({ 
      id: crypto.randomUUID(), 
      name: '', 
      price: '', 
      description: '', 
      images: [], 
      hidden: false,
      buttonText: 'Mais informações',
      linkType: 'whatsapp',
      imageAbove: true
    });
    setIsModalOpen(true);
  };

  const handleSaveNewProduct = () => {
    if (!tempProduct.name || !tempProduct.price) {
      toast.error("Preencha o nome e o preço!");
      return;
    }
    
    const exists = profile.catalog.find(i => i.id === tempProduct.id);
    const newCatalog = exists 
      ? profile.catalog.map(i => i.id === tempProduct.id ? tempProduct : i)
      : [...profile.catalog, tempProduct];

    onProfileChange({ ...profile, catalog: newCatalog });
    setIsModalOpen(false);
    toast.success(exists ? "Produto atualizado!" : "Produto adicionado!");
  };

  const removeCatalogItem = (id: string) => {
    onProfileChange({ ...profile, catalog: profile.catalog.filter(item => item.id !== id) });
    toast.error("Produto removido");
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = profile.catalog.findIndex(item => item.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === profile.catalog.length - 1)) return;
    const newCatalog = [...profile.catalog];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    [newCatalog[index], newCatalog[nextIndex]] = [newCatalog[nextIndex], newCatalog[index]];
    onProfileChange({ ...profile, catalog: newCatalog });
  };

  const handleProductImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProduct({ ...tempProduct, images: [reader.result as string] });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <DashboardAccordion>
        
        {/* 1. REDES SOCIAIS */}
        <AccordionSection value="redes" title="REDES SOCIAIS" icon={Share2} iconBgColor="bg-amber-500">
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-6">
                <div className="space-y-2"><label className="text-xs font-bold text-white uppercase tracking-wider">Telefone</label><input type="text" value={profile.contact.phone} onChange={(e) => handleContactChange("phone", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none" placeholder="+55 (11) 99999-9999" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-white uppercase tracking-wider">Instagram</label><div className="relative flex items-center"><span className="absolute left-4 text-gray-500 font-bold">@</span><input type="text" value={profile.contact.instagram} onChange={(e) => handleContactChange("instagram", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none" placeholder="usuario" /></div></div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2"><label className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp</label><input type="text" value={profile.contact.whatsapp} onChange={(e) => handleContactChange("whatsapp", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none" placeholder="+55 (11) 99999-9999" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-white uppercase tracking-wider">Website</label><input type="text" value={profile.contact.website} onChange={(e) => handleContactChange("website", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none" placeholder="https://seusite.com" /></div>
              </div>
            </div>
            <div className="flex justify-end pt-4"><button onClick={onSave} className="px-10 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg">Salvar</button></div>
          </div>
        </AccordionSection>

        {/* 2. PERSONALIZAÇÃO */}
        <AccordionSection value="personalization" title="PERSONALIZAÇÃO" icon={Palette} iconBgColor="bg-purple-600">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Foto de Perfil</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-white/10 overflow-hidden flex items-center justify-center">
                  {profile.avatar ? <img src={profile.avatar} alt="Perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast.info("Abrindo editor...")} className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all">Acessar Personalização</button>
                  <button onClick={() => handleInputChange("avatar", "")} className="w-11 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center rounded-xl transition-all"><Trash2 size={18} /></button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-11 h-11 bg-[#0a0a0a] border border-white/10 hover:border-white/20 text-white flex items-center justify-center rounded-xl transition-all"><Plus size={18} /></button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2"><label className="text-xs font-bold text-white uppercase tracking-wider">Nome</label><input type="text" value={profile.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none" placeholder="Seu nome completo" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-white uppercase tracking-wider">Bio</label><textarea value={profile.bio} onChange={(e) => handleInputChange("bio", e.target.value)} className="w-full h-24 bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-blue-500 outline-none resize-none" placeholder="Conte um pouco sobre você..." /></div>
            </div>
            <div className="flex justify-end pt-4"><button onClick={onSave} className="px-10 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg">Salvar</button></div>
          </div>
        </AccordionSection>

        {/* 3. ORDEM DOS LINKS */}
        <AccordionSection value="order" title="ORDEM DOS LINKS" icon={List} iconBgColor="bg-blue-500">
          <div className="p-6 text-center space-y-4">
            <p className="text-gray-400 text-sm">Arraste e solte para organizar a ordem dos seus links no cartão.</p>
            <div className="bg-[#0a0a0a] border border-dashed border-white/10 p-8 rounded-2xl text-gray-600">Funcionalidade de ordenação em desenvolvimento...</div>
          </div>
        </AccordionSection>

        {/* 4. PIX */}
        <AccordionSection value="pix" title="COBRE COM SEU PIX" icon={DollarSign} iconBgColor="bg-green-600">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Tipo de Chave</label>
                <select value={profile.pix.keyType} onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, keyType: e.target.value }})} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-green-500 transition-all appearance-none"><option value="cpf">CPF</option><option value="cnpj">CNPJ</option><option value="email">E-mail</option><option value="phone">Telefone</option><option value="random">Chave Aleatória</option></select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Chave PIX</label>
                <input type="text" value={profile.pix.key} onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, key: e.target.value }})} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-green-500" placeholder="Digite sua chave aqui" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Nome do Titular</label>
                <input type="text" value={profile.pix.name} onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, name: e.target.value }})} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-green-500" placeholder="Ex: Alex Santos" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Cidade</label>
                <input type="text" value={profile.pix.city} onChange={(e) => onProfileChange({...profile, pix: { ...profile.pix, city: e.target.value }})} className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-green-500" placeholder="Ex: SAO PAULO" />
              </div>
            </div>
            <div className="flex justify-end pt-4"><button onClick={onSave} className="px-10 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg">Salvar PIX</button></div>
          </div>
        </AccordionSection>

        {/* 5. CATÁLOGO DIGITAL */}
        <AccordionSection value="catalog" title="CATÁLOGO DIGITAL" icon={ShoppingCart} iconBgColor="bg-pink-600">
          <div className="p-6 space-y-6">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={showSearch} onChange={(e) => setShowSearch(e.target.checked)} className="w-4 h-4 rounded border-white/10 bg-[#0a0a0a] accent-blue-600 cursor-pointer" />
                <span className="text-xs text-gray-400">Exibir campo de busca (5+ itens)</span>
              </div>
              <button 
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus size={16} /> Adicionar Produto
              </button>
            </div>

            {showSearch && profile.catalog.length >= 5 && (
              <div className="relative mb-6">
                <input type="text" placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-10 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
            )}

            <div className="grid grid-cols-[100px_1fr_150px_100px_80px] gap-4 pb-2 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="text-center">Arraste</div>
              <div>Nome</div>
              <div>Preço</div>
              <div className="text-center">Ações</div>
              <div className="text-center">Ocultar</div>
            </div>

            <div className="space-y-1">
              {profile.catalog
                .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item, index) => (
                <div key={item.id} className={`grid grid-cols-[100px_1fr_150px_100px_80px] gap-4 items-center py-3 px-2 rounded-lg transition-all ${item.hidden ? 'opacity-40 grayscale' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                  <div className="flex justify-center gap-1">
                    <button onClick={() => moveItem(item.id, 'up')} className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-md hover:text-blue-400" disabled={index === 0}>▲</button>
                    <button onClick={() => moveItem(item.id, 'down')} className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-md hover:text-blue-400" disabled={index === profile.catalog.length - 1}>▼</button>
                  </div>
                  <div className="text-sm text-white font-medium">{item.name || "Sem nome"}</div>
                  <div className="text-sm text-white font-bold">{item.price || "R$ 0,00"}</div>
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setTempProduct(item); setIsModalOpen(true); }} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:text-blue-400"><Pencil size={14} /></button>
                    <button onClick={() => removeCatalogItem(item.id)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                  <div className="flex justify-center">
                    <div onClick={() => { const newCatalog = profile.catalog.map(i => i.id === item.id ? { ...i, hidden: !i.hidden } : i); onProfileChange({ ...profile, catalog: newCatalog }); }} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${item.hidden ? 'bg-white/10' : 'bg-blue-600'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.hidden ? 'left-1' : 'left-6'}`}></div></div>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL ADICIONAR PRODUTO (ATUALIZADO COM LAYOUT SOLICITADO) */}
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
                  
                  {/* LADO ESQUERDO: FORMULÁRIO */}
                  <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8 border-r border-white/5">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Configurar Produto</h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome do Produto</label>
                        <input type="text" value={tempProduct.name} onChange={(e) => setTempProduct({...tempProduct, name: e.target.value})} className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-white outline-none focus:border-blue-500" placeholder="Digite o nome do produto" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Descrição</label>
                        <textarea value={tempProduct.description} onChange={(e) => setTempProduct({...tempProduct, description: e.target.value})} className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 resize-none" placeholder="Digite uma breve descrição do produto" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Preço</label>
                          <input type="text" value={tempProduct.price} onChange={(e) => setTempProduct({...tempProduct, price: formatCurrency(e.target.value)})} className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-white outline-none focus:border-blue-500" placeholder="R$ 0,00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Texto do Botão</label>
                          <input type="text" value={tempProduct.buttonText || "Mais informações"} onChange={(e) => setTempProduct({...tempProduct, buttonText: e.target.value})} className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-white outline-none focus:border-blue-500" placeholder="Ex: Comprar Agora" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Link para o Botão</label>
                        <div className="flex flex-wrap gap-4">
                          {['whatsapp', 'link', 'pix'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="linkType" checked={(tempProduct.linkType || 'whatsapp') === type} onChange={() => setTempProduct({...tempProduct, linkType: type})} className="hidden" />
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${(tempProduct.linkType || 'whatsapp') === type ? 'border-blue-500 bg-blue-500' : 'border-white/10'}`}>
                                {(tempProduct.linkType || 'whatsapp') === type && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-xs text-gray-400 group-hover:text-white capitalize">{type === 'link' ? 'Link Customizado' : type === 'pix' ? 'Cobre com PIX' : 'WhatsApp'}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Imagens do Produto</label>
                        <div className="flex items-center gap-3 mb-4">
                          <input type="checkbox" checked={tempProduct.imageAbove !== false} onChange={(e) => setTempProduct({...tempProduct, imageAbove: e.target.checked})} className="w-4 h-4 rounded border-white/10 bg-[#0a0a0a] accent-blue-600 cursor-pointer" />
                          <span className="text-xs text-gray-400">Exibir as imagens acima do título e descrição</span>
                        </div>
                        <div onClick={() => productFileRef.current?.click()} className="w-32 h-32 bg-[#050505] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500/50 transition-all group">
                          {tempProduct.images?.[0] ? <img src={tempProduct.images[0]} className="w-full h-full object-contain rounded-2xl" /> : <><Plus className="text-gray-600 group-hover:text-blue-500" size={32} /><span className="text-[10px] font-bold text-gray-600 uppercase">Adicionar</span></>}
                        </div>
                        <input type="file" ref={productFileRef} onChange={handleProductImage} className="hidden" accept="image/*" />
                      </div>
                    </div>
                  </div>

                  {/* LADO DIREITO: PREVIEW EM TEMPO REAL (TAMANHO REAL E LAYOUT INVERTIDO) */}
                  <div className="w-full md:w-[400px] bg-[#050505] p-8 flex flex-col">
                    <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Preview do Produto</h2>
                    
                    <div className="flex-1 flex items-center justify-center overflow-y-auto custom-scrollbar">
                      <div className="w-full bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                        
                        {/* SE MARCADO: TEXTO EM CIMA DA IMAGEM */}
                        {tempProduct.imageAbove !== false ? (
                          <>
                            <div className="p-6 space-y-3">
                              <h3 className="text-lg font-bold text-white leading-tight">{tempProduct.name || "Nome do Produto"}</h3>
                              <p className="text-blue-400 font-black text-xl">{tempProduct.price || "R$ 0,00"}</p>
                              <p className="text-gray-500 text-xs">{tempProduct.description || "Sua descrição..."}</p>
                            </div>
                            {tempProduct.images?.[0] && (
                              <div className="w-full bg-black flex items-center justify-center">
                                <img src={tempProduct.images[0]} className="w-full h-auto object-contain" alt="Real size" />
                              </div>
                            )}
                          </>
                        ) : (
                          /* SE NÃO MARCADO: IMAGEM EM CIMA DO TEXTO (OU LAYOUT PADRÃO) */
                          <>
                            {tempProduct.images?.[0] && (
                              <div className="w-full bg-black flex items-center justify-center">
                                <img src={tempProduct.images[0]} className="w-full h-auto object-contain" alt="Real size" />
                              </div>
                            )}
                            <div className="p-6 space-y-3">
                              <h3 className="text-lg font-bold text-white leading-tight">{tempProduct.name || "Nome do Produto"}</h3>
                              <p className="text-blue-400 font-black text-xl">{tempProduct.price || "R$ 0,00"}</p>
                              <p className="text-gray-500 text-xs">{tempProduct.description || "Sua descrição..."}</p>
                            </div>
                          </>
                        )}

                        <div className="p-6 pt-0">
                          <button className="w-full h-12 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {(tempProduct.linkType || 'whatsapp') === 'whatsapp' && <MessageSquare size={16} />}
                            {tempProduct.buttonText || "Mais informações"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <button onClick={() => setIsModalOpen(false)} className="flex-1 h-12 text-gray-400 font-bold uppercase text-xs hover:text-white transition-all">Cancelar</button>
                      <button onClick={handleSaveNewProduct} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg uppercase text-xs tracking-widest">Salvar</button>
                    </div>
                  </div>

                </div>
              </div>
            )}
            <div className="flex justify-end pt-4"><button onClick={onSave} className="px-10 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg">Salvar Catálogo</button></div>
          </div>
        </AccordionSection>

        {/* 6. FORMULÁRIO DE CONTATOS */}
        <AccordionSection value="contact" title="FORMULÁRIO DE CONTATOS" icon={MessageSquare} iconBgColor="bg-cyan-600">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
              <span className="text-sm font-bold text-white">Ativar Formulário no Cartão</span>
              <div onClick={() => onProfileChange({...profile, contactForm: { ...profile.contactForm, enabled: !profile.contactForm.enabled }})} className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${profile.contactForm.enabled ? 'bg-blue-600' : 'bg-white/10'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.contactForm.enabled ? 'right-1' : 'left-1'}`}></div></div>
            </div>
            <div className="flex justify-end"><button onClick={onSave} className="px-10 h-12 bg-blue-600 text-white font-bold rounded-xl">Salvar Configuração</button></div>
          </div>
        </AccordionSection>

      </DashboardAccordion>
    </div>
  );
};

export default ProfileEditor;
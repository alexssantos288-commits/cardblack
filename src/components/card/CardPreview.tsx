import { UserProfile } from "@/types/profile";
import {
  Phone, Mail, Globe, MapPin, Linkedin, Instagram, Github, Twitter,
  Facebook, Youtube, Music, MessageCircle, Link, DollarSign,
  ExternalLink, Share2, QrCode, Star, User, Save, ShoppingBag,
  Utensils, Send, Award, Info, Wifi, Scale, Home, GlassWater,
  BriefcaseMedical, Scissors, Calendar, FileText, Gift, Music2,
  Disc, Clock, Camera, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generatePixPayload } from "@/lib/pixUtils";
import { ShareDialog } from "./ShareDialog";
import { Copy, Download, Check } from "lucide-react";

interface CardPreviewProps {
  profile: UserProfile;
  isFullScreen?: boolean;
  onSendMessage?: (message: any) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin,
  Instagram,
  Github,
  Twitter: X,
  Facebook,
  Youtube,
  Music,
  MessageCircle,
  Link,
  Globe,
  Star,
  QrCode,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Utensils,
  Send,
  Award,
  Info,
  Wifi,
  Scale,
  Home,
  GlassWater,
  BriefcaseMedical,
  Scissors,
  Calendar,
  FileText,
  Gift,
  Music2,
  Disc,
  Clock,
  Camera,
};

const CardPreview = ({ profile, isFullScreen = false, onSendMessage }: CardPreviewProps) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [pixOpen, setPixOpen] = useState(false);
  const [pixAmount, setPixAmount] = useState("");
  const [pixPayload, setPixPayload] = useState("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const containerClass = isFullScreen
    ? "min-h-screen w-full flex flex-col items-center"
    : "w-full max-w-[400px] mx-auto min-h-[800px]";

  const { style } = profile;

  const backgroundStyle = style?.backgroundType === 'image'
    ? { backgroundImage: `url(${style.backgroundValue})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
    : { background: style?.backgroundValue || 'linear-gradient(to bottom, #111827, #1e1b4b)', backgroundAttachment: 'fixed' };

  const customStyle = {
    backgroundColor: style?.itemColor + (style?.opacity !== undefined ? Math.round(style.opacity * 2.55).toString(16).padStart(2, '0') : 'ff'),
    color: style?.textColor,
    borderRadius: style?.borderRadius || '24px',
  };

  const itemColorWithOpacity = (opacityScale = 1) => {
    const alpha = style?.opacity !== undefined ? Math.round(style.opacity * opacityScale * 2.55).toString(16).padStart(2, '0') : 'ff';
    return `${style?.itemColor}${alpha}`;
  };

  // Helper to render a link button
  const LinkButton = ({ icon: Icon, label, url, onClick }: any) => {
    const content = (
      <Button
        variant="glass"
        className="w-full h-16 flex items-center justify-center gap-3 border border-white/10 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
        style={{
          ...customStyle,
          backgroundColor: itemColorWithOpacity(1),
          fontSize: '1.1rem',
          fontWeight: '500',
        }}
        onClick={onClick}
      >
        {Icon && (
          <Icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: style?.textColor }} />
        )}
        <span style={{ color: style?.textColor }}>{label}</span>
      </Button>
    );

    if (url) {
      return (
        <a href={url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="block w-full group">
          {content}
        </a>
      );
    }

    return null; // Don't render empty links if they don't have an onClick action
  };

  const handleSaveContact = () => {
    // Create vCard
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `FN:${profile.name || 'Contato'}\n`;

    if (profile.company) {
      vcard += `ORG:${profile.company}\n`;
    }

    if (profile.bio) {
      vcard += `NOTE:${profile.bio}\n`;
    }

    if (profile.contact.phone) {
      vcard += `TEL;TYPE=WORK,VOICE:${profile.contact.phone}\n`;
    }

    if (profile.contact.whatsapp) {
      vcard += `TEL;TYPE=CELL:${profile.contact.whatsapp}\n`;
    }

    if (profile.contact.email) {
      vcard += `EMAIL:${profile.contact.email}\n`;
    }

    if (profile.contact.website) {
      vcard += `URL:${profile.contact.website}\n`;
    }

    if (profile.contact.address) {
      vcard += `ADR:;;${profile.contact.address};;;;\n`;
    }

    vcard += 'END:VCARD\n';

    // Create blob and download
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name || 'contato'}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Contato preparado para download!");
  };

  const handleGeneratePix = () => {
    if (!profile.pix.key) {
      toast.error("Chave PIX não configurada!");
      return;
    }

    const payload = generatePixPayload(
      profile.pix.key,
      profile.pix.name || profile.name,
      profile.pix.city || "SAO PAULO",
      pixAmount ? parseFloat(pixAmount.replace(',', '.')) : undefined
    );
    setPixPayload(payload);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleFormSubmit = () => {
    if (onSendMessage) {
      const requiredFields = profile.contactForm.fields.filter(f => f.enabled && f.required);
      const missingFields = requiredFields.filter(f => !formData[f.id]);

      if (missingFields.length > 0) {
        toast.error(`Por favor, preencha o campo: ${missingFields[0].label}`);
        return;
      }

      onSendMessage({
        id: Date.now().toString(),
        name: formData['name'] || '',
        email: formData['email'] || '',
        phone: formData['phone'] || '',
        message: formData['message'] || '',
        date: new Date().toISOString(),
      });

      setFormData({});
      toast.success("Sua mensagem foi enviada!");
    } else {
      toast.success("Sua mensagem foi enviada!");
    }
  };

  return (
    <div
      className={`${containerClass} overflow-y-auto overflow-x-hidden font-sans pb-10 custom-scrollbar`}
      style={{
        ...backgroundStyle
      }}
    >
      <div className="w-full max-w-[400px]">
        {/* Header with Avatar and Action Card */}
        <div className="relative pt-24 px-4">
          {/* Avatar centered at the top */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-in zoom-in duration-500">
            <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <User className="w-20 h-20" />
                </div>
              )}
            </div>
          </div>

          {/* Action Card Section */}
          <div
            className="relative pt-20 pb-8 px-6 text-center z-10 overflow-hidden border border-white/5 animate-in fade-in duration-1000"
            style={{
              backgroundColor: 'transparent',
              borderWidth: '0.5px',
              borderRadius: style?.borderRadius || '32px',
              color: style?.textColor
            }}
          >
            {/* Name & Title */}
            <div className="mb-6 pt-2">
              <h1 className="text-2xl font-bold mb-3">{profile.name || "Seu Nome"}</h1>
              <p className="opacity-80 text-sm whitespace-pre-wrap">{profile.bio || "Sua Biografia"}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-4 mt-8 px-4 w-full">
              {/* Save Button */}
              <Button
                variant="hero"
                className="w-full h-16 rounded-full p-0 flex items-center justify-between overflow-hidden shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none group"
                onClick={handleSaveContact}
              >
                <span className="flex-1 text-center font-bold text-lg uppercase tracking-wider pl-4">
                  Salvar na agenda
                </span>
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full mr-2 border border-white/30 transition-transform group-hover:scale-110">
                  <Save className="w-6 h-6" />
                </div>
              </Button>

              {/* Share Button */}
              <Button
                variant="hero"
                className="w-full h-16 rounded-full p-0 flex items-center justify-between overflow-hidden shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none group"
                onClick={() => setShareOpen(true)}
              >
                <span className="flex-1 text-center font-bold text-lg uppercase tracking-wider pl-4">
                  Compartilhar
                </span>
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full mr-2 border border-white/30 transition-transform group-hover:scale-110">
                  <Share2 className="w-6 h-6" />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Buttons List */}
        <div className="mt-6 px-4 space-y-4">
          {(() => {
            // Comprehensive icon mapping helper
            const getIconByTitle = (title: string, currentIcon?: any) => {
              const t = title.toLowerCase();
              if (t.includes('whatsapp')) return MessageCircle;
              if (t.includes('instagram')) return Instagram;
              if (t.includes('facebook')) return Facebook;
              if (t.includes('linkedin')) return Linkedin;
              if (t.includes('twitter') || t.includes(' x ')) return Twitter;
              if (t.includes('youtube')) return Youtube;
              if (t.includes('tiktok')) return Music;
              if (t.includes('spotify')) return Music;
              if (t.includes('google') || t.includes('avalia')) return Globe;
              if (t.includes('telefone') || t.includes('celular') || t.includes('ligar')) return Phone;
              if (t.includes('email') || t.includes('e-mail')) return Mail;
              if (t.includes('site') || t.includes('web') || t.includes('loja')) return Globe;
              if (t.includes('mapa') || t.includes('localização') || t.includes('endereço')) return MapPin;
              if (t.includes('pix') || t.includes('pagar') || t.includes('cobre')) return DollarSign;

              if (currentIcon && typeof currentIcon !== 'string') return currentIcon;
              if (currentIcon && typeof currentIcon === 'string') {
                if (currentIcon === "None") return null;
                return iconMap[currentIcon] || Link;
              }

              return Link;
            };

            const standardLinksData: Record<string, any> = {
              phone: {
                icon: Phone,
                label: "Telefone",
                url: profile.contact.phone ? `tel:${profile.contact.phone}` : ""
              },
              whatsapp: {
                icon: MessageCircle,
                label: "WhatsApp",
                url: profile.contact.whatsapp ? `https://wa.me/${profile.contact.whatsapp.replace(/\D/g, '')}` : ""
              },
              email: {
                icon: Mail,
                label: "E-mail",
                url: profile.contact.email ? `mailto:${profile.contact.email}` : ""
              },
              address: {
                icon: MapPin,
                label: "Localização",
                url: profile.contact.address ? `https://maps.google.com/?q=${encodeURIComponent(profile.contact.address)}` : ""
              },
              website: {
                icon: Globe,
                label: "Website",
                url: profile.contact.website || ""
              },
              pix: {
                icon: QrCode,
                label: "PIX QR Code",
                url: "",
                onClick: () => setPixOpen(true)
              },
              google: {
                icon: Globe,
                label: "Avaliações no Google",
                url: profile.socialLinks.find(l => l.platform.toLowerCase().includes('google'))?.url || ""
              },
              instagram: {
                icon: Instagram,
                label: "Instagram",
                url: profile.socialLinks.find(l => l.platform.toLowerCase() === 'instagram')?.url || ""
              }
            };

            // Only keep standard links that actually have content
            const activeStandardLinks: Record<string, any> = {};
            if (profile.contact.phone) activeStandardLinks.phone = standardLinksData.phone;
            if (profile.contact.whatsapp) activeStandardLinks.whatsapp = standardLinksData.whatsapp;
            if (profile.contact.email) activeStandardLinks.email = standardLinksData.email;
            if (profile.contact.address) activeStandardLinks.address = standardLinksData.address;
            if (profile.contact.website) activeStandardLinks.website = standardLinksData.website;
            if (profile.pix.enabled && profile.pix.key) activeStandardLinks.pix = standardLinksData.pix;

            // Social links from the array
            profile.socialLinks.forEach(link => {
              const platformLower = link.platform.toLowerCase();
              if (link.url) {
                activeStandardLinks[platformLower] = {
                  icon: iconMap[link.icon] || getIconByTitle(link.platform),
                  label: link.platform,
                  url: link.url
                };
              }
            });

            const defaultOrder = [
              'phone', 'whatsapp', 'email', 'address', 'instagram', 'facebook', 'twitter', 'linkedin', 'spotify', 'youtube', 'tiktok', 'website', 'google', 'pix'
            ];

            const currentOrder = [...(profile.linkOrder || defaultOrder)];

            // Add custom links and any social links that might be missing from the order
            profile.customLinks.forEach(cl => {
              if (!currentOrder.includes(cl.id)) currentOrder.push(cl.id);
            });

            Object.keys(activeStandardLinks).forEach(id => {
              if (!currentOrder.includes(id)) currentOrder.push(id);
            });

            // Filter out duplicates and nulls
            const renderedIds = new Set();
            const items = currentOrder.map(id => {
              if (renderedIds.has(id)) return null;

              const standardLink = activeStandardLinks[id] || activeStandardLinks[id.toLowerCase()];
              const customLink = profile.customLinks.find(l => l.id === id);

              const isIconOnly = customLink
                ? !!customLink.linkIconOnly
                : !!(profile.standardLinkIconOnly && profile.standardLinkIconOnly[id]);

              if (standardLink) {
                renderedIds.add(id);
                return { ...standardLink, id, isIconOnly };
              }

              if (customLink) {
                renderedIds.add(id);
                return {
                  id,
                  icon: getIconByTitle(customLink.title, customLink.icon),
                  label: customLink.title || "Link",
                  url: customLink.url,
                  isIconOnly
                };
              }
              return null;
            }).filter(Boolean);

            // Group icon-only items that are adjacent
            const elements: React.ReactNode[] = [];
            let currentIconGroup: any[] = [];

            const renderIconGroup = (group: any[]) => {
              if (group.length === 0) return null;
              return (
                <div key={`group-${group[0].id}`} className="flex flex-wrap justify-center gap-4 py-2">
                  {group.map(item => {
                    const Icon = item.icon;
                    const url = item.url;
                    const content = (
                      <div
                        key={item.id}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg border border-white/10 group"
                        style={{
                          backgroundColor: itemColorWithOpacity(1),
                          color: style?.textColor,
                        }}
                        title={item.label}
                        onClick={item.onClick}
                      >
                        {Icon ? (
                          <Icon className="w-7 h-7 transition-transform group-hover:rotate-6" />
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-center px-1 truncate">{item.label}</span>
                        )}
                      </div>
                    );

                    if (url) {
                      return (
                        <a
                          key={item.id}
                          href={url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {content}
                        </a>
                      );
                    }
                    return content;
                  })}
                </div>
              );
            };

            items.forEach((item: any) => {
              if (item.isIconOnly) {
                currentIconGroup.push(item);
              } else {
                if (currentIconGroup.length > 0) {
                  elements.push(renderIconGroup(currentIconGroup));
                  currentIconGroup = [];
                }
                elements.push(<LinkButton key={item.id} {...item} />);
              }
            });

            if (currentIconGroup.length > 0) {
              elements.push(renderIconGroup(currentIconGroup));
            }

            return elements;
          })()}
        </div>

        {/* Catalog and Contact Form */}
        <div className="mt-8 px-4 space-y-8 pb-10">
          {/* Catalog */}
          {profile.catalog.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center" style={{ color: style?.textColor }}>Catálogo</h3>
              <div className="grid gap-4">
                {profile.catalog.map((item) => (
                  <div key={item.id} className="p-4 border border-white/5 flex flex-col" style={customStyle}>
                    {item.images && item.images.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden w-full bg-black/5">
                        <img src={item.images[0]} alt={item.name} className="w-full h-auto block object-contain" />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <span className="font-bold opacity-90">{item.price}</span>
                    </div>
                    <p className="text-sm opacity-80 mb-6 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{item.description}</p>
                    <div className="flex justify-end mt-auto">
                      <Button
                        className="w-fit h-10 px-6 rounded-full border-none transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] shadow-lg font-medium text-sm"
                        style={{ backgroundColor: style?.textColor, color: style?.itemColor }}
                        onClick={() => window.open(item.linkType === 'whatsapp' ? `https://wa.me/?text=${encodeURIComponent(`Interesse em: ${item.name}`)}` : item.linkUrl, '_blank')}
                      >
                        {item.buttonText}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Form */}
          {profile.contactForm.enabled && (
            <div className="p-6 border border-white/10 space-y-4" style={customStyle}>
              <h3 className="text-xl font-bold text-center">{profile.contactForm.title || "Fale Conosco"}</h3>
              <div className="space-y-3">
                {profile.contactForm.fields.filter(f => f.enabled).map(field => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-xs font-medium uppercase tracking-wider" style={{ opacity: 0.8 }}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="w-full min-h-[100px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <Button
                  className="w-full h-12 rounded-xl mt-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg font-bold"
                  style={{ backgroundColor: style?.textColor, color: style?.itemColor }}
                  onClick={handleFormSubmit}
                >
                  Enviar Mensagem
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        profileUrl={window.location.href}
        userName={profile.name}
      />

      <Dialog open={pixOpen} onOpenChange={(open) => {
        setPixOpen(open);
        if (!open) { setPixPayload(""); setPixAmount(""); }
      }}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              PIX QR Code
            </DialogTitle>
            <DialogDescription>
              {profile.pix.key ? "Gere um QR Code para receber pagamentos via PIX." : "Configure sua chave PIX no editor primeiro."}
            </DialogDescription>
          </DialogHeader>

          {profile.pix.key ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider opacity-60">Valor (Opcional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">R$</span>
                  <Input
                    placeholder="0,00"
                    value={pixAmount}
                    onChange={(e) => setPixAmount(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-border"
                  />
                </div>
              </div>

              <Button
                onClick={handleGeneratePix}
                className="w-full h-12 rounded-xl gradient-primary font-bold shadow-glow border-none"
              >
                Gerar QR Code
              </Button>

              {pixPayload && (
                <div className="space-y-4 pt-4 border-t border-border/30 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-center p-4 bg-white rounded-2xl shadow-inner border border-border/50">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`}
                      alt="PIX QR Code"
                      className="w-48 h-48"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-muted/50 border border-border/30 text-[10px] sm:text-xs font-mono break-all opacity-80">
                      {pixPayload}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl gap-2 hover:bg-white/5"
                      onClick={handleCopyPix}
                    >
                      {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedPix ? "Copiado!" : "Copiar Código PIX"}
                    </Button>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                    Beneficiário: {profile.pix.name || profile.name}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground italic text-sm">
              Você ainda não configurou uma chave PIX no seu perfil.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardPreview;

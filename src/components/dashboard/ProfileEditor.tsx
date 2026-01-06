import { UserProfile, SocialLink, CustomLink, CatalogItem } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Share2,
  Palette,
  List,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Image,
  FileText,
  GripVertical,
  Pencil,
  Search,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProfileEditorProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onSave: () => void;
}

const socialPlatforms = [
  { name: "LinkedIn", icon: "Linkedin" },
  { name: "Instagram", icon: "Instagram" },
  { name: "Twitter", icon: "Twitter" },
  { name: "Facebook", icon: "Facebook" },
  { name: "YouTube", icon: "Youtube" },
  { name: "TikTok", icon: "Music" },
  { name: "WhatsApp", icon: "MessageCircle" },
  { name: "Google", icon: "Globe" },
];

const pixKeyTypes = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave Aleatória" },
];

import PersonalizationModal from "./PersonalizationModal";
import ContactFormModal from "./ContactFormModal";
import ProductModal from "./ProductModal";
import CustomLinkModal from "./CustomLinkModal";
import { useState } from "react";

const ProfileEditor = ({ profile, onProfileChange, onSave }: ProfileEditorProps) => {
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);
  const [isContactFormModalOpen, setIsContactFormModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomLinkModalOpen, setIsCustomLinkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [editingCustomLink, setEditingCustomLink] = useState<CustomLink | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Personal info handlers
  const handleChange = (field: keyof UserProfile, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  const handleContactChange = (field: keyof UserProfile["contact"], value: string) => {
    onProfileChange({
      ...profile,
      contact: { ...profile.contact, [field]: value },
    });
  };

  // Social links handlers
  const handleSocialChange = (id: string, field: keyof SocialLink, value: string) => {
    const updatedLinks = profile.socialLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    onProfileChange({ ...profile, socialLinks: updatedLinks });
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "LinkedIn",
      url: "",
      icon: "Linkedin",
    };
    onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
  };

  const removeSocialLink = (id: string) => {
    onProfileChange({
      ...profile,
      socialLinks: profile.socialLinks.filter((link) => link.id !== id),
    });
  };

  const handlePlatformChange = (id: string, platform: string) => {
    const selectedPlatform = socialPlatforms.find((p) => p.name === platform);
    const updatedLinks = profile.socialLinks.map((link) =>
      link.id === id ? { ...link, platform, icon: selectedPlatform?.icon || "Globe" } : link
    );
    onProfileChange({ ...profile, socialLinks: updatedLinks });
  };

  // Custom links handlers
  const addCustomLink = () => {
    setEditingCustomLink(null);
    setIsCustomLinkModalOpen(true);
  };

  const handleSaveCustomLink = (link: CustomLink) => {
    if (editingCustomLink) {
      const updatedLinks = profile.customLinks.map((l) => (l.id === link.id ? link : l));
      onProfileChange({ ...profile, customLinks: updatedLinks });
    } else {
      const currentOrder = profile.linkOrder || [...standardLinks.map(l => l.id), ...profile.customLinks.map(l => l.id)];
      const updatedOrder = currentOrder.includes(link.id) ? currentOrder : [...currentOrder, link.id];
      onProfileChange({
        ...profile,
        customLinks: [...profile.customLinks, link],
        linkOrder: updatedOrder
      });
    }
    setEditingCustomLink(null);
  };

  const handleEditCustomLink = (id: string) => {
    const link = profile.customLinks.find(l => l.id === id);
    if (link) {
      setEditingCustomLink(link);
      setIsCustomLinkModalOpen(true);
    }
  };

  const removeCustomLink = (id: string) => {
    onProfileChange({
      ...profile,
      customLinks: profile.customLinks.filter((link) => link.id !== id),
    });
  };

  const handleCustomLinkChange = (id: string, field: keyof CustomLink, value: string) => {
    const updatedLinks = profile.customLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    onProfileChange({ ...profile, customLinks: updatedLinks });
  };

  // PIX handlers
  const handlePixChange = (field: keyof UserProfile["pix"], value: string | boolean) => {
    onProfileChange({
      ...profile,
      pix: { ...profile.pix, [field]: value },
    });
  };

  // Catalog handlers
  const handleSaveProduct = (item: CatalogItem) => {
    if (editingProduct) {
      // Edit existing
      const updatedCatalog = profile.catalog.map((p) => (p.id === item.id ? item : p));
      onProfileChange({ ...profile, catalog: updatedCatalog });
    } else {
      // Add new
      onProfileChange({ ...profile, catalog: [...profile.catalog, item] });
    }
    setEditingProduct(null);
  };

  const handleEditProduct = (item: CatalogItem) => {
    setEditingProduct(item);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const removeCatalogItem = (id: string) => {
    onProfileChange({
      ...profile,
      catalog: profile.catalog.filter((item) => item.id !== id),
    });
  };

  // Contact form handlers
  const handleContactFormChange = (field: keyof UserProfile["contactForm"], value: boolean | string) => {
    onProfileChange({
      ...profile,
      contactForm: { ...profile.contactForm, [field]: value },
    });
  };

  const handleContactFormFieldChange = (field: keyof UserProfile["contactForm"]["fields"], value: boolean) => {
    onProfileChange({
      ...profile,
      contactForm: {
        ...profile.contactForm,
        fields: { ...profile.contactForm.fields, [field]: value },
      },
    });
  };

  const removeMessage = (id: string) => {
    onProfileChange({
      ...profile,
      messages: (profile.messages || []).filter((msg) => msg.id !== id),
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const standardLinks = [
    { title: "Telefone", id: "phone" },
    { title: "WhatsApp", id: "whatsapp" },
    { title: "E-mail", id: "email" },
    { title: "Localização", id: "address" },
    { title: "Website", id: "website" },
    { title: "Instagram", id: "instagram" },
    { title: "Facebook", id: "facebook" },
    { title: "X / Twitter", id: "twitter" },
    { title: "LinkedIn", id: "linkedin" },
    { title: "Spotify", id: "spotify" },
    { title: "YouTube", id: "youtube" },
    { title: "TikTok", id: "tiktok" },
    { title: "Avaliações no Google", id: "google" },
    { title: "PIX", id: "pix" },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Create a merged current order that includes all active links
      const activeIdsList = [
        ...profile.customLinks.map(l => l.id),
        ...(profile.contact.phone ? ['phone'] : []),
        ...(profile.contact.whatsapp ? ['whatsapp'] : []),
        ...(profile.contact.email ? ['email'] : []),
        ...(profile.contact.address ? ['address'] : []),
        ...(profile.contact.website ? ['website'] : []),
        ...(profile.pix.enabled && profile.pix.key ? ['pix'] : []),
        ...profile.socialLinks.filter(l => !!l.url).map(l => l.id.toLowerCase())
      ];

      const currentOrder = [...(profile.linkOrder || [])];
      activeIdsList.forEach(id => {
        if (!currentOrder.includes(id)) currentOrder.push(id);
      });

      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
        onProfileChange({ ...profile, linkOrder: newOrder });
      }
    }
  };

  const removeLinkFromOrder = (id: string) => {
    const activeIdsList = [
      ...profile.customLinks.map(l => l.id),
      ...(profile.contact.phone ? ['phone'] : []),
      ...(profile.contact.whatsapp ? ['whatsapp'] : []),
      ...(profile.contact.email ? ['email'] : []),
      ...(profile.contact.address ? ['address'] : []),
      ...(profile.contact.website ? ['website'] : []),
      ...(profile.pix.enabled && profile.pix.key ? ['pix'] : []),
      ...profile.socialLinks.filter(l => !!l.url).map(l => l.id.toLowerCase())
    ];

    const currentOrder = [...(profile.linkOrder || [])];
    activeIdsList.forEach(itemId => {
      if (!currentOrder.includes(itemId)) currentOrder.push(itemId);
    });

    const newOrder = currentOrder.filter(itemId => itemId !== id);

    // If it's a custom link, also remove it from customLinks
    const isCustom = profile.customLinks.some(l => l.id === id);
    if (isCustom) {
      onProfileChange({
        ...profile,
        linkOrder: newOrder,
        customLinks: profile.customLinks.filter(l => l.id !== id),
      });
    } else {
      onProfileChange({ ...profile, linkOrder: newOrder });
    }
  };

  const SortableLinkItem = ({ id, title, isCustom, iconOnly }: { id: string, title: string, isCustom: boolean, iconOnly: boolean }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleIconOnlyToggle = (checked: boolean) => {
      if (isCustom) {
        const updatedLinks = profile.customLinks.map((link) =>
          link.id === id ? { ...link, linkIconOnly: checked } : link
        );
        onProfileChange({ ...profile, customLinks: updatedLinks });
      } else {
        // For standard links we need to store this preference somewhere.
        // Let's add it to the profile state. For now, since we don't have a place for it in standard links,
        // we'll focus on custom links as requested if that's the primary use case, 
        // but I'll add a 'standardLinkIconOnly' map to UserProfile to support all.
        const iconOnlyMap = profile.standardLinkIconOnly || {};
        onProfileChange({
          ...profile,
          standardLinkIconOnly: { ...iconOnlyMap, [id]: checked }
        });
      }
    };

    return (
      <tr ref={setNodeRef} style={style} className="hover:bg-muted/30 group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground p-1 hover:text-white transition-colors">
              <GripVertical className="w-4 h-4" />
            </div>
            {isCustom ? (
              <Input
                value={title}
                onChange={(e) => handleCustomLinkChange(id, "title", e.target.value)}
                placeholder="Título do link"
                className="h-8 bg-background border border-border placeholder:text-muted-foreground text-sm text-white focus-visible:ring-offset-0"
              />
            ) : (
              <span className="text-sm text-white font-medium">{title}</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center">
            <Switch
              checked={iconOnly}
              onCheckedChange={handleIconOnlyToggle}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center gap-1">
            {isCustom && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditCustomLink(id)}
                className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLinkFromOrder(id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const AccordionHeader = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="font-display font-semibold text-white">{label}</span>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Accordion Sections */}
      <Accordion type="multiple" className="space-y-3">


        {/* Social Links */}
        <AccordionItem value="social" className="bg-card rounded-xl border border-border/50 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-white">REDES SOCIAIS</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Telefone</Label>
                  <Input
                    value={profile.contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    placeholder="+55 (11) 99999-9999"
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">WhatsApp</Label>
                  <Input
                    value={profile.contact.whatsapp}
                    onChange={(e) => handleContactChange("whatsapp", e.target.value)}
                    placeholder="+55 (11) 99999-9999"
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Email</Label>
                  <Input
                    value={profile.contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    placeholder="demo@cartaonfc.com"
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Website</Label>
                  <Input
                    value={profile.contact.website}
                    onChange={(e) => handleContactChange("website", e.target.value)}
                    placeholder="https://seusite.com"
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Instagram</Label>
                  <div className="flex rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <div className="flex items-center justify-center px-3 bg-muted/50 border-r border-border text-muted-foreground rounded-l-md">
                      <span className="text-sm">@</span>
                    </div>
                    <Input
                      value={profile.socialLinks.find(l => l.platform === "Instagram")?.url || ""}
                      onChange={(e) => {
                        const existing = profile.socialLinks.find(l => l.platform === "Instagram");
                        if (existing) {
                          handleSocialChange(existing.id, "url", e.target.value);
                        } else {
                          const newLink = { id: "instagram", platform: "Instagram", url: e.target.value, icon: "Instagram" };
                          onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                        }
                      }}
                      placeholder="usuario"
                      className="border-0 focus-visible:ring-0 bg-transparent text-white placeholder:text-muted-foreground px-3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Facebook</Label>
                  <Input
                    value={profile.socialLinks.find(l => l.platform === "Facebook")?.url || ""}
                    onChange={(e) => {
                      const existing = profile.socialLinks.find(l => l.platform === "Facebook");
                      if (existing) {
                        handleSocialChange(existing.id, "url", e.target.value);
                      } else {
                        const newLink = { id: "facebook", platform: "Facebook", url: e.target.value, icon: "Facebook" };
                        onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                      }
                    }}
                    placeholder="https://facebook.com/..."
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">X / Twitter</Label>
                  <div className="flex rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <div className="flex items-center justify-center px-3 bg-muted/50 border-r border-border text-muted-foreground rounded-l-md">
                      <span className="text-sm">@</span>
                    </div>
                    <Input
                      value={profile.socialLinks.find(l => l.platform === "Twitter")?.url || ""}
                      onChange={(e) => {
                        const existing = profile.socialLinks.find(l => l.platform === "Twitter");
                        if (existing) {
                          handleSocialChange(existing.id, "url", e.target.value);
                        } else {
                          const newLink = { id: "twitter", platform: "Twitter", url: e.target.value, icon: "Twitter" };
                          onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                        }
                      }}
                      placeholder="usuario"
                      className="border-0 focus-visible:ring-0 bg-transparent text-white placeholder:text-muted-foreground px-3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">LinkedIn</Label>
                  <Input
                    value={profile.socialLinks.find(l => l.platform === "LinkedIn")?.url || ""}
                    onChange={(e) => {
                      const existing = profile.socialLinks.find(l => l.platform === "LinkedIn");
                      if (existing) {
                        handleSocialChange(existing.id, "url", e.target.value);
                      } else {
                        const newLink = { id: "linkedin", platform: "LinkedIn", url: e.target.value, icon: "Linkedin" };
                        onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                      }
                    }}
                    placeholder="https://linkedin.com/in/..."
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Spotify</Label>
                  <Input
                    value={profile.socialLinks.find(l => l.platform === "Spotify")?.url || ""}
                    onChange={(e) => {
                      const existing = profile.socialLinks.find(l => l.platform === "Spotify");
                      if (existing) {
                        handleSocialChange(existing.id, "url", e.target.value);
                      } else {
                        const newLink = { id: "spotify", platform: "Spotify", url: e.target.value, icon: "Music" };
                        onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                      }
                    }}
                    placeholder="https://open.spotify.com/..."
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">YouTube</Label>
                  <Input
                    value={profile.socialLinks.find(l => l.platform === "YouTube")?.url || ""}
                    onChange={(e) => {
                      const existing = profile.socialLinks.find(l => l.platform === "YouTube");
                      if (existing) {
                        handleSocialChange(existing.id, "url", e.target.value);
                      } else {
                        const newLink = { id: "youtube", platform: "YouTube", url: e.target.value, icon: "Youtube" };
                        onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                      }
                    }}
                    placeholder="https://youtube.com/..."
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">TikTok</Label>
                  <div className="flex rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <div className="flex items-center justify-center px-3 bg-muted/50 border-r border-border text-muted-foreground rounded-l-md">
                      <span className="text-sm">@</span>
                    </div>
                    <Input
                      value={profile.socialLinks.find(l => l.platform === "TikTok")?.url || ""}
                      onChange={(e) => {
                        const existing = profile.socialLinks.find(l => l.platform === "TikTok");
                        if (existing) {
                          handleSocialChange(existing.id, "url", e.target.value);
                        } else {
                          const newLink = { id: "tiktok", platform: "TikTok", url: e.target.value, icon: "Music" };
                          onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                        }
                      }}
                      placeholder="usuario"
                      className="border-0 focus-visible:ring-0 bg-transparent text-white placeholder:text-muted-foreground px-3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Localização</Label>
                  <Input
                    value={profile.contact.address}
                    onChange={(e) => handleContactChange("address", e.target.value)}
                    placeholder="São Paulo, Brasil"
                    className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Avaliações no Google</Label>
                <Input
                  value={profile.socialLinks.find(l => l.platform === "Google")?.url || ""}
                  onChange={(e) => {
                    const existing = profile.socialLinks.find(l => l.platform === "Google");
                    if (existing) {
                      handleSocialChange(existing.id, "url", e.target.value);
                    } else {
                      const newLink = { id: "google", platform: "Google", url: e.target.value, icon: "Globe" };
                      onProfileChange({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                    }
                  }}
                  placeholder="https://g.page/..."
                  className="bg-background border border-border placeholder:text-muted-foreground text-white focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]" onClick={onSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Personalization */}
        <AccordionItem value="personalization" className="bg-card rounded-xl border border-border/50 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-white">PERSONALIZAÇÃO</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">Nome</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-background border border-blue-500 ring-1 ring-blue-500 placeholder:text-muted-foreground text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white font-medium">Biografia</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  className="bg-background border border-border min-h-[100px] placeholder:text-muted-foreground text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Imagem de Perfil</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <Input
                      value={profile.avatar}
                      onChange={(e) => handleChange("avatar", e.target.value)}
                      placeholder="URL da imagem (opcional)"
                      className="bg-background border border-border placeholder:text-muted-foreground text-white"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-9 w-9 relative bg-background border-border hover:bg-muted">
                        <Share2 className="w-4 h-4 -rotate-90" /> {/* Using Share2 rotated as upload icon substitute or Upload if available */}
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleChange("avatar", reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Button>
                      <span className="text-xs text-muted-foreground self-center">
                        Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" className="text-foreground border-border hover:bg-muted" onClick={() => setIsPersonalizationModalOpen(true)}>
                  Acessar personalização
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]" onClick={onSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Custom Links */}
        <AccordionItem value="links" className="bg-card rounded-xl border border-border/50 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <AccordionHeader icon={List} label="ORDEM E OUTROS LINKS" />
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Arraste os links para reordenar como eles aparecerão no seu cartão.</p>
                <Button variant="hero" size="sm" onClick={addCustomLink}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Link
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Arraste Título</th>
                      <th className="px-4 py-3 font-medium text-center">Exibir apenas ícone</th>
                      <th className="px-4 py-3 font-medium text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <SortableContext
                      items={(profile.linkOrder || [...standardLinks.map(l => l.id), ...profile.customLinks.map(l => l.id)])}
                      strategy={verticalListSortingStrategy}
                    >
                      {(() => {
                        // Define what constitutes an "active" link
                        const activeIdsList = [
                          ...profile.customLinks.map(l => l.id),
                          ...(profile.contact.phone ? ['phone'] : []),
                          ...(profile.contact.whatsapp ? ['whatsapp'] : []),
                          ...(profile.contact.email ? ['email'] : []),
                          ...(profile.contact.address ? ['address'] : []),
                          ...(profile.contact.website ? ['website'] : []),
                          ...(profile.pix.enabled && profile.pix.key ? ['pix'] : []),
                          ...profile.socialLinks.filter(l => !!l.url).map(l => l.id.toLowerCase())
                        ];

                        const activeIdsSet = new Set(activeIdsList.map(id => id.toLowerCase()));

                        const currentItems = [...(profile.linkOrder || [])];
                        activeIdsList.forEach(id => {
                          if (!currentItems.includes(id)) currentItems.push(id);
                        });

                        return currentItems
                          .filter(id => activeIdsSet.has(id.toLowerCase()))
                          .map((id) => {
                            const standard = standardLinks.find(l => l.id === id);
                            const custom = profile.customLinks.find(l => l.id === id);
                            if (!standard && !custom) return null;

                            const isIconOnly = custom
                              ? !!custom.linkIconOnly
                              : !!(profile.standardLinkIconOnly && profile.standardLinkIconOnly[id]);

                            return (
                              <SortableLinkItem
                                key={id}
                                id={id}
                                title={standard ? standard.title : custom?.title || ""}
                                isCustom={!!custom}
                                iconOnly={isIconOnly}
                              />
                            );
                          });
                      })()}
                    </SortableContext>
                  </tbody>
                </table>
              </DndContext>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PIX */}
        <AccordionItem value="pix" className="bg-card rounded-xl border border-border/50 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <AccordionHeader icon={DollarSign} label="COBRE COM PIX" />
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground/80">Cobre seus clientes com PIX QR Code ou PIX Copia e Cola</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Tipo da chave PIX</Label>
                  <Select
                    value={profile.pix.keyType}
                    onValueChange={(value) => handlePixChange("keyType", value)}
                  >
                    <SelectTrigger className="w-full h-11 bg-background border-border/50 text-white rounded-xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="dark bg-background border-border/50">
                      {pixKeyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-muted/20 focus:bg-muted/20 focus:text-white cursor-pointer">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Chave PIX</Label>
                  <Input
                    value={profile.pix.key}
                    onChange={(e) => handlePixChange("key", e.target.value)}
                    placeholder="Digite sua chave pix"
                    autoComplete="new-password"
                    name="pix-key-no-autofill"
                    className="bg-background border-border/50 h-11 rounded-xl placeholder:text-muted-foreground/70 text-white focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Nome do beneficiário (até 25 letras)</Label>
                  <Input
                    value={profile.pix.name}
                    onChange={(e) => handlePixChange("name", e.target.value)}
                    placeholder="Seu nome...."
                    className="bg-background border-border/50 h-11 rounded-xl placeholder:text-muted-foreground/50 text-white focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Cidade do beneficiário (até 15 letras)</Label>
                  <Input
                    value={profile.pix.city || ""}
                    onChange={(e) => handlePixChange("city", e.target.value)}
                    placeholder="Sua cidade...."
                    className="bg-background border-border/50 h-11 rounded-xl placeholder:text-muted-foreground/50 text-white focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
                <p className="text-sm text-blue-400/90 text-center font-medium">
                  Configure sua chave PIX para permitir que seus clientes façam pagamentos diretamente pelo seu cartão digital.
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={onSave}
                  className="bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-black font-semibold px-8 h-10 rounded-xl transition-all shadow-lg shadow-teal-500/20"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Catalog */}
        <AccordionItem value="catalog" className="bg-card rounded-xl border border-border/50 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <AccordionHeader icon={ShoppingCart} label="CRIAÇÃO DE CATÁLOGO" />
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  <span className="text-sm text-muted-foreground">Exibir campo de busca quando tiver 5 ou mais itens</span>
                </div>
                <Button variant="hero" size="sm" onClick={handleAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar produto
                </Button>
              </div>

              {profile.catalog.length === 0 ? (
                <div className="rounded-lg border border-border bg-muted/20 p-8 text-center">
                  <p className="text-muted-foreground font-medium">Nenhum produto no catálogo ainda.</p>
                  <p className="text-sm text-muted-foreground">Clique em "Adicionar produto" para começar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.catalog.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg border border-border bg-background flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        {item.images && item.images.length > 0 && (
                          <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(item)}
                          className="text-white hover:bg-white/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCatalogItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Contact Form */}
        <AccordionItem value="contact-form" className="bg-card rounded-xl border border-border/50 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <AccordionHeader icon={MessageSquare} label="FORMULÁRIO DE CONTATOS" />
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium">Formulário de Contatos</h3>
                <p className="text-sm text-muted-foreground">Use o formulário como ferramenta de Marketing para coletar informações dos seus "Leads"</p>
              </div>
              <div className="flex gap-3">
                <Button variant="hero" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar contatos
                </Button>
                <Button variant="hero" size="sm" onClick={() => setIsContactFormModalOpen(true)}>
                  <Palette className="w-4 h-4 mr-2" />
                  Editar formulário
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                  <Input
                    placeholder="Digite para pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-background/80 border border-border pl-10 h-11 rounded-xl placeholder:text-muted-foreground/60 text-white focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">Data inicial</span>
                  <Input type="date" className="w-36 bg-background border border-border text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">Data final</span>
                  <Input type="date" className="w-36 bg-background border border-border text-white" />
                </div>
              </div>

              {!profile.messages || profile.messages.length === 0 ? (
                <div className="rounded-lg border border-border bg-muted/20 p-8 text-center">
                  <p className="text-muted-foreground font-medium">Nenhum contato registrado</p>
                  <p className="text-sm text-muted-foreground">Quando alguém preencher seu formulário, aparecerá aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border bg-background/50">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-center w-20">Ações</th>
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">Telefone</th>
                        <th className="px-4 py-3">E-mail</th>
                        <th className="px-4 py-3">Mensagem</th>
                        <th className="px-4 py-3">Enviado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {(profile.messages || [])
                        .filter(msg =>
                          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((msg) => (
                          <tr key={msg.id} className="hover:bg-muted/20 transition-colors group">
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMessage(msg.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                            <td className="px-4 py-3 text-sm text-white font-medium">{msg.name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{msg.phone || '-'}</td>
                            <td className="px-4 py-3 text-sm text-blue-400 hover:underline cursor-pointer truncate max-w-[150px]">
                              <a href={`mailto:${msg.email}`}>{msg.email}</a>
                            </td>
                            <td className="px-4 py-3 text-sm text-white/80 max-w-[200px] truncate" title={msg.message}>
                              {msg.message}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(msg.date).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <PersonalizationModal
        profile={profile}
        onProfileChange={onProfileChange}
        open={isPersonalizationModalOpen}
        onOpenChange={setIsPersonalizationModalOpen}
      />
      <ContactFormModal
        profile={profile}
        onProfileChange={onProfileChange}
        open={isContactFormModalOpen}
        onOpenChange={setIsContactFormModalOpen}
      />
      <ProductModal
        item={editingProduct}
        onSave={handleSaveProduct}
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
      />
      <CustomLinkModal
        open={isCustomLinkModalOpen}
        onOpenChange={setIsCustomLinkModalOpen}
        onSave={handleSaveCustomLink}
        editingLink={editingCustomLink}
      />
    </div >
  );
};

export default ProfileEditor;
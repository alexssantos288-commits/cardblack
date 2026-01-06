export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  linkIconOnly?: boolean;
}

export interface CatalogItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  images?: string[];
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  themeColor: string; // Adicionado
  buttonStyle: string; // Adicionado
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    address: string;
  };
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
  linkOrder: string[];
  standardLinkIconOnly: Record<string, boolean>;
  pix: {
    enabled: boolean;
    keyType: string;
    key: string;
    name: string;
    city: string;
  };
  catalog: CatalogItem[];
  contactForm: {
    enabled: boolean;
    title: string;
    fields: {
      name: boolean;
      email: boolean;
      phone: boolean;
      message: boolean;
    };
  };
}
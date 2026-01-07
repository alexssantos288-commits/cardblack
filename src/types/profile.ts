export interface CatalogItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  images?: string[];
  hidden?: boolean;
  buttonText?: string;      // ADICIONADO
  linkType?: string;        // ADICIONADO
  imageAbove?: boolean;     // ADICIONADO
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  themeColor: string;
  buttonStyle: 'rounded' | 'square';
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    spotify: string;
    youtube: string;
    tiktok: string;
    location: string;
    googleReviews: string;
    address: string;
  };
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
  socialLinks: any[];
  customLinks: any[];
  linkOrder: string[];
  standardLinkIconOnly: any;
}
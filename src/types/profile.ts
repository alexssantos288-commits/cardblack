export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
}

export interface PixInfo {
  enabled: boolean;
  key: string;
  keyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  name: string;
  city: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  buttonText: string;
  linkType: 'whatsapp' | 'custom' | 'pix';
  linkUrl: string;
  imageAboveTitle: boolean;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  enabled: boolean;
}

export interface ContactFormSettings {
  enabled: boolean;
  title: string;
  receiveNotifications: boolean;
  emailNotifications?: string;
  fields: FormField[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkIconOnly?: boolean;
}

export interface StyleConfig {
  itemColor: string;
  textColor: string;
  opacity: number;
  borderRadius: string;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundValue?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
  coverImage: string;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
  pix: PixInfo;
  catalog: CatalogItem[];
  contactForm: ContactFormSettings;
  theme: 'light' | 'dark';
  accentColor: string;
  style: StyleConfig;
  linkOrder?: string[];
  standardLinkIconOnly?: Record<string, boolean>;
  messages: ContactMessage[];
}

export const defaultProfile: UserProfile = {
  id: '1',
  name: '',
  title: '',
  company: '',
  bio: '',
  avatar: '',
  coverImage: '',
  contact: {
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
  },
  socialLinks: [],
  customLinks: [],
  pix: {
    enabled: false,
    key: '',
    keyType: 'cpf',
    name: '',
    city: '',
  },
  catalog: [],
  contactForm: {
    enabled: false,
    title: 'Fale Conosco',
    receiveNotifications: false,
    fields: [
      { id: 'name', type: 'text', label: 'Nome', placeholder: 'Seu nome', required: true, enabled: true },
      { id: 'email', type: 'email', label: 'E-mail', placeholder: 'seu@email.com', required: true, enabled: true },
      { id: 'phone', type: 'tel', label: 'Telefone', placeholder: '(00) 00000-0000', required: false, enabled: true },
      { id: 'message', type: 'textarea', label: 'Mensagem', placeholder: 'Sua mensagem...', required: true, enabled: true },
    ],
  },
  theme: 'dark',
  accentColor: 'cyan',
  style: {
    itemColor: '#2d295a',
    textColor: '#ffffff',
    opacity: 100,
    borderRadius: '12px',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(to bottom, #6366f1, #a855f7)',
  },
  standardLinkIconOnly: {},
  messages: [],
};

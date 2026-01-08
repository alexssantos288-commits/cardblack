export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  themeColor: string;
  textColor?: string; // Nova
  buttonOpacity?: number; // Nova
  borderRadius?: number; // Nova
  background?: { // Nova
    type: 'solid' | 'gradient' | 'image';
    value: string;
    image?: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    website: string;
    location: string;
    tiktok?: string;
    twitter?: string;
    spotify?: string;
    googleReviews?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  pix: {
    enabled: boolean;
    key: string;
    keyType: string;
    name: string;
    city: string;
  };
  catalog: any[];
  contactForm: {
    enabled: boolean;
    title: string;
    fields: any[];
    destination: 'email' | 'whatsapp';
  };
}
export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  telegram?: string;
  address: string;
  hours: BusinessHours;
  featured: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  articles?: Article[];
  businessType: 'shop' | 'professional' | 'service';
  appointmentBooking?: boolean;
  approved?: boolean;
  active?: boolean;
  owner_id?: string;
  created_at?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

export interface Article {
  id: string;
  businessId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  available: boolean;
  createdAt: Date;
  rating?: number;
  reviews_count?: number;
  offer?: {
    discountPrice: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessRegistration {
  // Dati anagrafici
  businessName: string;
  ownerName: string;
  vatNumber: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  whatsapp: string;
  telegram?: string;
  
  // Dati attività
  category: string;
  businessType: 'shop' | 'professional' | 'service';
  description: string;
  logo?: string | null;
  coverImage?: string | null;
  
  // Orari
  hours: BusinessHours;
  
  // Servizi
  appointmentBooking: boolean;
  
  // Articoli/Servizi
  articles: Omit<Article, 'id' | 'businessId' | 'createdAt'>[];
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  user_type: 'customer' | 'business_owner' | 'admin' | 'manager';
  is_banned?: boolean;
  banned_reason?: string;
  banned_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Comment {
  id: string;
  business_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  rating: number;
  created_at: string;
  is_flagged?: boolean;
  flag_reason?: string;
}

export interface AdminStats {
  total_businesses: number;
  total_users: number;
  total_comments: number;
  flagged_comments: number;
  banned_users: number;
  pending_businesses: number;
}
// Sistema di persistenza locale con sincronizzazione
export interface StorageData {
  users: any[];
  businesses: any[];
  categories: any[];
  comments: any[];
  settings: any;
}

class LocalStorageManager {
  private static instance: LocalStorageManager;
  private listeners: Map<string, Set<() => void>> = new Map();

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  // Inizializza il storage con dati di default
  initialize() {
    if (!this.get('borgo_initialized')) {
      this.initializeDefaultData();
      this.set('borgo_initialized', true);
    }
  }

  private initializeDefaultData() {
    // Utenti di default
    const defaultUsers = [
      {
        id: 'user-1',
        email: 'mario.rossi@email.com',
        name: 'Mario Rossi',
        password: 'password123',
        created_at: '2024-01-15T10:30:00Z',
        user_type: 'customer',
        is_banned: false
      },
      {
        id: 'user-2',
        email: 'elena.bianchi@boutique.com',
        name: 'Elena Bianchi',
        password: 'password123',
        created_at: '2024-02-20T14:15:00Z',
        user_type: 'business_owner',
        is_banned: false
      },
      {
        id: 'admin-1',
        email: 'admin@borgo.com',
        name: 'Admin Sistema',
        password: 'admin123',
        created_at: '2024-01-01T00:00:00Z',
        user_type: 'admin',
        is_banned: false
      }
    ];

    // Categorie di default
    const defaultCategories = [
      { id: 'restaurant', name: 'Ristorazione', color: 'bg-orange-400' },
      { id: 'shopping', name: 'Shopping', color: 'bg-orange-300' },
      { id: 'services', name: 'Servizi', color: 'bg-orange-500' },
      { id: 'wellness', name: 'Benessere', color: 'bg-orange-200' },
      { id: 'professional', name: 'Professionisti', color: 'bg-orange-600' },
      { id: 'culture', name: 'Cultura', color: 'bg-orange-100' }
    ];

    // Commenti di default
    const defaultComments = [
      {
        id: 'comment-1',
        business_id: '1',
        user_id: 'user-1',
        user_name: 'Mario Rossi',
        content: 'Ottimo ristorante, cibo eccellente!',
        rating: 5,
        created_at: '2024-03-10T19:30:00Z',
        is_flagged: false
      }
    ];

    // Attività demo - TUTTE nel sistema di storage
    const demoBusinesses = [
      {
        id: '1',
        name: 'Trattoria da Mario',
        category: 'restaurant',
        description: 'Autentica cucina tradizionale con ingredienti km 0. Specialità della casa: pasta fatta a mano e carni alla griglia.',
        image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        reviewCount: 47,
        phone: '+39 0123 456789',
        whatsapp: '+39 333 1234567',
        address: 'Via Roma 15, 20121 Milano',
        hours: '12:00-14:30, 19:00-23:00',
        featured: true,
        coordinates: { lat: 45.4654, lng: 9.1859 },
        businessType: 'shop',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '2',
        name: 'Boutique Elena',
        category: 'shopping',
        description: 'Abbigliamento femminile di tendenza e accessori unici. Collezioni esclusive e consulenza personalizzata.',
        image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        reviewCount: 23,
        phone: '+39 0123 987654',
        whatsapp: '+39 333 7654321',
        address: 'Corso Italia 8, 20122 Milano',
        hours: '9:00-13:00, 15:30-19:30',
        featured: true,
        coordinates: { lat: 45.4669, lng: 9.1917 },
        businessType: 'shop',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '3',
        name: 'Caffè Centrale',
        category: 'restaurant',
        description: 'Il punto di ritrovo del paese. Caffè di qualità, cornetti freschi e aperitivi con vista piazza.',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.4,
        reviewCount: 89,
        phone: '+39 0123 555333',
        whatsapp: '+39 333 5553333',
        address: 'Piazza del Duomo 1, 20121 Milano',
        hours: '6:00-20:00',
        featured: false,
        coordinates: { lat: 45.4640, lng: 9.1896 },
        businessType: 'shop',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '4',
        name: 'Studio Medico Rossi',
        category: 'professional',
        description: 'Medicina generale e specialistica. Prenotazioni online e consulenze a domicilio.',
        image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        reviewCount: 156,
        phone: '+39 0123 777888',
        whatsapp: '+39 333 7778888',
        address: 'Via Nazionale 42, 20123 Milano',
        hours: '8:00-12:00, 14:00-18:00',
        featured: true,
        coordinates: { lat: 45.4676, lng: 9.1881 },
        businessType: 'professional',
        appointmentBooking: true,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '5',
        name: 'Centro Estetico Armonia',
        category: 'wellness',
        description: 'Trattamenti viso e corpo, massaggi rilassanti. Ambiente accogliente e personale qualificato.',
        image: 'https://images.pexels.com/photos/3997992/pexels-photo-3997992.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        reviewCount: 34,
        phone: '+39 0123 444555',
        whatsapp: '+39 333 4445555',
        address: 'Via delle Rose 7, 20124 Milano',
        hours: '9:00-18:00',
        featured: false,
        coordinates: { lat: 45.4625, lng: 9.1943 },
        businessType: 'service',
        appointmentBooking: true,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '6',
        name: 'Libreria del Borgo',
        category: 'culture',
        description: 'Libri, cancelleria e idee regalo. Spazio eventi culturali e presentazioni autori.',
        image: 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.5,
        reviewCount: 28,
        phone: '+39 0123 666777',
        whatsapp: '+39 333 6667777',
        address: 'Via Garibaldi 12, 20121 Milano',
        hours: '9:00-13:00, 15:00-19:00',
        featured: false,
        coordinates: { lat: 45.4651, lng: 9.1877 },
        businessType: 'shop',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '7',
        name: 'Farmacia San Giuseppe',
        category: 'services',
        description: 'Farmacia di fiducia con servizio a domicilio. Consulenze farmaceutiche e prodotti per la salute.',
        image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        reviewCount: 67,
        phone: '+39 0123 333444',
        whatsapp: '+39 333 3334444',
        address: 'Via San Giuseppe 23, 20125 Milano',
        hours: '8:30-12:30, 15:00-19:30',
        featured: true,
        coordinates: { lat: 45.4688, lng: 9.1923 },
        businessType: 'service',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '8',
        name: 'Parrucchiere Stile',
        category: 'wellness',
        description: 'Salone di bellezza moderno. Tagli, colori e trattamenti per capelli. Prodotti professionali.',
        image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        reviewCount: 41,
        phone: '+39 0123 222333',
        whatsapp: '+39 333 2223333',
        address: 'Corso Buenos Aires 45, 20124 Milano',
        hours: '9:00-18:00',
        featured: false,
        coordinates: { lat: 45.4712, lng: 9.2034 },
        businessType: 'service',
        appointmentBooking: true,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '9',
        name: 'Ferramenta Moderna',
        category: 'services',
        description: 'Tutto per la casa e il fai-da-te. Consulenza tecnica e servizio di riparazione.',
        image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.3,
        reviewCount: 52,
        phone: '+39 0123 111222',
        whatsapp: '+39 333 1112222',
        address: 'Via Torino 67, 20123 Milano',
        hours: '8:00-12:00, 14:30-18:30',
        featured: false,
        coordinates: { lat: 45.4598, lng: 9.1834 },
        businessType: 'service',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '10',
        name: 'Pizzeria del Borgo',
        category: 'restaurant',
        description: 'Pizza napoletana autentica cotta nel forno a legna. Ingredienti DOP e impasto a lunga lievitazione.',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        reviewCount: 93,
        phone: '+39 0123 999888',
        whatsapp: '+39 333 9998888',
        address: 'Via Milano 34, 20126 Milano',
        hours: '18:00-24:00',
        featured: true,
        coordinates: { lat: 45.4723, lng: 9.1756 },
        businessType: 'shop',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '11',
        name: 'Ottica Visione',
        category: 'professional',
        description: 'Occhiali da vista e da sole delle migliori marche. Esami della vista e lenti a contatto.',
        image: 'https://images.pexels.com/photos/947885/pexels-photo-947885.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.5,
        reviewCount: 38,
        phone: '+39 0123 777666',
        whatsapp: '+39 333 7776666',
        address: 'Piazza Venezia 9, 20121 Milano',
        hours: '9:30-12:30, 15:30-19:00',
        featured: false,
        coordinates: { lat: 45.4634, lng: 9.1912 },
        businessType: 'professional',
        appointmentBooking: true,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      },
      {
        id: '12',
        name: 'Gelateria Dolce Vita',
        category: 'restaurant',
        description: 'Gelato artigianale con ingredienti naturali. Gusti stagionali e specialità della casa.',
        image: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        reviewCount: 124,
        phone: '+39 0123 555777',
        whatsapp: '+39 333 5557777',
        address: 'Via Brera 18, 20121 Milano',
        hours: '12:00-23:00',
        featured: true,
        coordinates: { lat: 45.4701, lng: 9.1889 },
        businessType: 'shop',
        appointmentBooking: false,
        created_at: '2024-01-01T00:00:00Z',
        approved: true,
        active: true,
        approval_status: 'approved'
      }
    ];
    this.set('borgo_users', defaultUsers);
    this.set('borgo_categories', defaultCategories);
    this.set('borgo_comments', defaultComments);
    this.set('borgo_businesses', demoBusinesses);
  }

  // Metodi base per storage
  get(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners(key);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  // Sistema di notifiche per aggiornamenti in tempo reale
  subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Ritorna funzione per unsubscribe
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notifyListeners(key: string): void {
    this.listeners.get(key)?.forEach(callback => callback());
  }

  // Metodi specifici per entità
  getUsers(): any[] {
    return this.get('borgo_users') || [];
  }

  addUser(user: any): void {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      created_at: user.created_at || new Date().toISOString()
    };
    users.push(newUser);
    this.set('borgo_users', users);
  }

  updateUser(userId: string, updates: any): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.set('borgo_users', users);
    }
  }

  deleteUser(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.set('borgo_users', filtered);
  }

  getBusinesses(): any[] {
    return this.get('borgo_businesses') || [];
  }

  addBusiness(business: any): void {
    const businesses = this.getBusinesses();
    const newBusiness = {
      ...business,
      id: business.id || `business-${Date.now()}`,
      created_at: business.created_at || new Date().toISOString(),
      approved: business.approved !== undefined ? business.approved : (business.id ? undefined : false),
      active: business.active !== undefined ? business.active : (business.id ? undefined : true),
      approval_status: business.approval_status || (business.id ? undefined : 'pending')
    };
    businesses.push(newBusiness);
    this.set('borgo_businesses', businesses);
  }

  updateBusiness(businessId: string, updates: any): void {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex(b => b.id === businessId);
    if (index !== -1) {
      businesses[index] = { ...businesses[index], ...updates };
      this.set('borgo_businesses', businesses);
    }
  }

  deleteBusiness(businessId: string): void {
    const businesses = this.getBusinesses();
    const filtered = businesses.filter(b => b.id !== businessId);
    this.set('borgo_businesses', filtered);
  }

  getCategories(): any[] {
    return this.get('borgo_categories') || [];
  }

  addCategory(category: any): void {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: category.id || `category-${Date.now()}`
    };
    categories.push(newCategory);
    this.set('borgo_categories', categories);
  }

  updateCategory(categoryId: string, updates: any): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.set('borgo_categories', categories);
    }
  }

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== categoryId);
    this.set('borgo_categories', filtered);
  }

  getComments(): any[] {
    return this.get('borgo_comments') || [];
  }

  // Products management
  getBusinessProducts(businessId: string): any[] {
    return this.get(`borgo_products_${businessId}`) || [];
  }

  addBusinessProduct(businessId: string, product: any): void {
    const products = this.getBusinessProducts(businessId);
    if (products.length >= 5) {
      throw new Error('Limite massimo di 5 prodotti raggiunto');
    }
    const newProduct = {
      ...product,
      id: product.id || `product-${Date.now()}`,
      businessId,
      createdAt: product.createdAt || new Date().toISOString()
    };
    products.push(newProduct);
    this.set(`borgo_products_${businessId}`, products);
  }

  updateBusinessProduct(businessId: string, productId: string, updates: any): void {
    const products = this.getBusinessProducts(businessId);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.set(`borgo_products_${businessId}`, products);
    }
  }

  deleteBusinessProduct(businessId: string, productId: string): void {
    const products = this.getBusinessProducts(businessId);
    const filtered = products.filter(p => p.id !== productId);
    this.set(`borgo_products_${businessId}`, filtered);
  }
  addComment(comment: any): void {
    const comments = this.getComments();
    const newComment = {
      ...comment,
      id: comment.id || `comment-${Date.now()}`,
      created_at: comment.created_at || new Date().toISOString()
    };
    comments.push(newComment);
    this.set('borgo_comments', comments);
  }

  updateComment(commentId: string, updates: any): void {
    const comments = this.getComments();
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      comments[index] = { ...comments[index], ...updates };
      this.set('borgo_comments', comments);
    }
  }

  deleteComment(commentId: string): void {
    const comments = this.getComments();
    const filtered = comments.filter(c => c.id !== commentId);
    this.set('borgo_comments', filtered);
  }

  // Statistiche per dashboard
  getStats(): any {
    const users = this.getUsers();
    const businesses = this.getBusinesses();
    const comments = this.getComments();
    
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total_users: users.length,
      total_businesses: businesses.length,
      total_comments: comments.length,
      banned_users: users.filter(u => u.is_banned).length,
      featured_businesses: businesses.filter(b => b.featured).length,
      flagged_comments: comments.filter(c => c.is_flagged).length,
      users_last_7_days: users.filter(u => new Date(u.created_at) >= last7Days).length,
      users_last_30_days: users.filter(u => new Date(u.created_at) >= last30Days).length,
      businesses_last_7_days: businesses.filter(b => new Date(b.created_at || b.createdAt || 0) >= last7Days).length,
      businesses_last_30_days: businesses.filter(b => new Date(b.created_at || b.createdAt || 0) >= last30Days).length
    };
  }

  // Backup e restore
  exportData(): StorageData {
    return {
      users: this.getUsers(),
      businesses: this.getBusinesses(),
      categories: this.getCategories(),
      comments: this.getComments(),
      settings: this.get('borgo_settings') || {}
    };
  }

  importData(data: StorageData): void {
    this.set('borgo_users', data.users);
    this.set('borgo_businesses', data.businesses);
    this.set('borgo_categories', data.categories);
    this.set('borgo_comments', data.comments);
    this.set('borgo_settings', data.settings);
  }

  // Reset completo
  reset(): void {
    const keys = [
      'borgo_users',
      'borgo_businesses', 
      'borgo_categories',
      'borgo_comments',
      'borgo_settings',
      'borgo_initialized'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    this.initialize();
  }
}

export const storageManager = LocalStorageManager.getInstance();

// Hook React per utilizzare il storage con aggiornamenti in tempo reale
import { useState, useEffect } from 'react';

export function useStorageData<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [data, setData] = useState<T>(() => {
    return storageManager.get(key) || defaultValue;
  });

  useEffect(() => {
    const unsubscribe = storageManager.subscribe(key, () => {
      setData(storageManager.get(key) || defaultValue);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  const updateData = (value: T) => {
    storageManager.set(key, value);
  };

  return [data, updateData];
}
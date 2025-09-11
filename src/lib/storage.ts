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
    // Inizializza solo le strutture vuote - APP REALE
    this.set('borgo_users', []);
    this.set('borgo_categories', []);
    this.set('borgo_comments', []);
    this.set('borgo_businesses', []);
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
      id: business.id || `business-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

// Default export for better module resolution
export default storageManager;

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
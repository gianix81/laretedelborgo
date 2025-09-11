import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MapPin, Search, Star, Phone, MessageCircle, Clock, Grid, Map, Navigation, X, Crosshair, Filter, LogOut, User, Crown, Menu } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Business, Category, UserLocation, BusinessRegistration } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { useAuth } from './hooks/useAuth';
import { storageManager, useStorageData } from './lib/storage';
import GoogleMap from './components/GoogleMap';
import BusinessCard from './components/BusinessCard';
import LocationPermissionBanner from './components/LocationPermissionBanner';
import BusinessRegistrationModal from './components/BusinessRegistration';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import ManagerPanel from './components/ManagerPanel';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import ContactsModal from './components/ContactsModal';
import BusinessDashboard from './components/BusinessDashboard';
import DigitalStore from './components/DigitalStore';
import { openGoogleMapsDirections, calculateDistance, formatDistance } from './utils/directions';

const businesses: Business[] = [
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
    appointmentBooking: false
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
    appointmentBooking: false
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
    appointmentBooking: false
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
    appointmentBooking: true
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
    appointmentBooking: true
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
    appointmentBooking: false
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
    appointmentBooking: false
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
    appointmentBooking: true
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
    appointmentBooking: false
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
    appointmentBooking: false
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
    appointmentBooking: true
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
    appointmentBooking: false
  }
];

const categories: Category[] = [
  { id: 'restaurant', name: 'Ristorazione', icon: <MapPin className="w-5 h-5" />, color: 'bg-orange-400' },
  { id: 'shopping', name: 'Shopping', icon: <MapPin className="w-5 h-5" />, color: 'bg-orange-300' },
  { id: 'services', name: 'Servizi', icon: <MapPin className="w-5 h-5" />, color: 'bg-orange-500' },
  { id: 'wellness', name: 'Benessere', icon: <MapPin className="w-5 h-5" />, color: 'bg-orange-200' },
  { id: 'professional', name: 'Professionisti', icon: <MapPin className="w-5 h-5" />, color: 'bg-orange-600' },
  { id: 'culture', name: 'Cultura', icon: <MapPin className="w-5 h-5" />, color: 'bg-orange-100' },
];


function App() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showLocationBanner, setShowLocationBanner] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showManagerPanel, setShowManagerPanel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showBusinessDashboard, setShowBusinessDashboard] = useState(false);
  const [selectedBusinessForDashboard, setSelectedBusinessForDashboard] = useState<Business | null>(null);
  const [showDigitalStore, setShowDigitalStore] = useState(false);
  const [selectedBusinessForStore, setSelectedBusinessForStore] = useState<Business | null>(null);
  const [storeInitialTab, setStoreInitialTab] = useState<'activity' | 'reviews' | 'products'>('activity');

  const { location: userLocation, loading: locationLoading, error: locationError, refetch: refetchLocation } = useGeolocation();
  const { user, loading: authLoading, signIn, signUp, signOut, updateUserType, error: authError } = useAuth();

  const [savedBusinesses] = useStorageData('borgo_businesses', []);
  const [savedCategories] = useStorageData('borgo_categories', []);
  
  const allBusinesses = useMemo(() => {
    return [...businesses, ...savedBusinesses];
  }, [savedBusinesses]);
  
  const allCategories = useMemo(() => {
    return savedCategories.length > 0 ? savedCategories : categories;
  }, [savedCategories]);

  const filteredBusinesses = useMemo(() => {
    let filtered = allBusinesses.filter(business => {
      const matchesCategory = !selectedCategory || business.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Attività visibili: devono essere approvate E attive
      const isVisible = business.approved === true && business.active !== false;
      
      return matchesCategory && matchesSearch && isVisible;
    });

    if (sortBy === 'distance' && userLocation) {
      filtered = filtered.sort((a, b) => {
        const distanceA = calculateDistance(userLocation, a.coordinates);
        const distanceB = calculateDistance(userLocation, b.coordinates);
        return distanceA - distanceB;
      });
    } else {
      filtered = filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
    }

    return filtered.slice(0, 10);
  }, [allBusinesses, selectedCategory, searchTerm, userLocation, sortBy]);

  const handleGetDirections = (business: Business) => {
    openGoogleMapsDirections(business, userLocation);
  };

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleBusinessRegistration = (data: BusinessRegistration) => {
    const newBusiness = {
      name: data.businessName,
      category: data.category,
      description: data.description,
      image: data.coverImage || 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      reviewCount: 0,
      phone: data.phone,
      whatsapp: data.whatsapp,
      telegram: data.telegram,
      address: data.address,
      hours: `${data.hours.monday.open}-${data.hours.monday.close}`,
      featured: false,
      coordinates: { lat: 45.4654 + Math.random() * 0.01, lng: 9.1859 + Math.random() * 0.01 },
      businessType: data.businessType,
      appointmentBooking: data.appointmentBooking,
      articles: data.articles,
      owner_id: user?.id,
      approved: false,
      active: false,
      approval_status: 'pending'
    };
    
    storageManager.addBusiness(newBusiness);
    alert('Attività registrata con successo! La tua richiesta è in attesa di approvazione da parte del nostro team. Riceverai una notifica quando sarà approvata.');
  };

  const handleRegisterActivity = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    if (user.user_type === 'customer') {
      alert('Per registrare un\'attività devi avere un account Esercente/Professionista. Vai nelle Impostazioni per cambiare il tipo di account.');
      return;
    }
    
    // Controlla se l'utente ha già un'attività (solo per business_owner, non per manager)
    if (user.user_type === 'business_owner') {
      const userBusiness = allBusinesses.find(b => b.owner_id === user.id);
      if (userBusiness) {
        alert('Puoi registrare solo una attività per account. Usa la Dashboard per gestire la tua attività esistente.');
        return;
      }
    }
    
    setShowRegistration(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">La Rete del Borgo</h2>
          <p className="text-gray-600">Caricamento in corso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthModal
          isOpen={true}
          onClose={() => {}} // Cannot close if not logged in
          onSignIn={signIn}
          onSignUp={signUp}
          loading={authLoading}
          error={authError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">La Rete del Borgo</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Centro commerciale virtuale</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Menu Button */}
              {user && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  title="Menu"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              )}
              
              {/* Location Status */}
              <div className="hidden md:flex items-center gap-2">
                {locationLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    Localizzazione...
                  </div>
                ) : userLocation ? (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Crosshair className="w-4 h-4" />
                    Posizione attiva
                  </div>
                ) : (
                  <button
                    onClick={refetchLocation}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Attiva posizione
                  </button>
                )}
              </div>

              <div className="hidden lg:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4 mr-1 inline" />
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'map' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4 mr-1 inline" />
                  Mappa
                </button>
              </div>
              
              <button 
                onClick={handleRegisterActivity}
                className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm"
              >
                <span className="hidden sm:inline">Registra Attività</span>
                <span className="sm:hidden">+</span>
              </button>
              
              <div className="flex items-center gap-1 sm:gap-3">
                {user.user_type === 'manager' && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setShowManagerPanel(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2"
                      title="Pannello Manager"
                    >
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Manager</span>
                    </button>
                    <span className="hidden md:inline bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                      Creatore App
                    </span>
                  </div>
                )}
                
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.name || user.email}</span>
                  {user.user_type === 'business_owner' && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      Business
                    </span>
                  )}
                  {user.user_type === 'admin' && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                  {user.user_type === 'customer' && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      Cliente
                    </span>
                  )}
                </div>
                {user.user_type === 'admin' && (
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2"
                    title="Pannello Admin"
                  >
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">A</span>
                    </div>
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}
                {user.user_type === 'manager' && (
                  <span className="hidden md:inline bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                    Manager
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  title="Esci"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto py-6 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Scopri le migliori attività del borgo
            </h2>
            <p className="text-sm sm:text-lg text-gray-700 max-w-2xl mx-auto px-4">
              Il tuo centro commerciale virtuale dove trovare tutto ciò di cui hai bisogno, 
              a portata di click e vicino a casa.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto px-2">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca attività, prodotti, servizi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="flex-1 sm:flex-none px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm text-gray-700"
                  >
                    <option value="">Tutte le categorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                  className="flex-1 sm:flex-none px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm text-gray-700"
                >
                  <option value="distance">Per vicinanza</option>
                  <option value="rating">Per punteggio</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Tutte
              </button>
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${category.color}`}></span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Location Permission Banner */}
        {showLocationBanner && !userLocation && !locationError && (
          <LocationPermissionBanner
            onRequestLocation={refetchLocation}
            onDismiss={() => setShowLocationBanner(false)}
          />
        )}

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Errore di geolocalizzazione
                </h3>
                <p className="text-xs sm:text-sm text-red-700 mb-2">{locationError}</p>
                <button
                  onClick={refetchLocation}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Riprova
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Prime {filteredBusinesses.length} attività
            </h3>
            <div className="hidden sm:block">
              {sortBy === 'distance' && userLocation ? (
              <span className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                📍 Ordinate per distanza
              </span>
            ) : sortBy === 'rating' ? (
              <span className="text-sm text-gray-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                ⭐ Ordinate per punteggio
              </span>
            ) : (
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                📍 Attiva posizione per ordinare per distanza
              </span>
            )}
            </div>
            
          </div>
          
          {/* Mobile View Toggle */}
          <div className="sm:hidden flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-full">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                viewMode === 'grid' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              <Grid className="w-3 h-3" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                viewMode === 'map' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              <Map className="w-3 h-3" />
              Mappa
            </button>
          </div>
          
          {/* Desktop View Toggle */}
          <div className="hidden sm:flex lg:hidden items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4 mr-1 inline" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'map' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-4 h-4 mr-1 inline" />
              Mappa
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          /* Grid View - Primary View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                categories={allCategories}
                onSelect={handleBusinessSelect}
                onGetDirections={handleGetDirections}
                userLocation={userLocation}
              />
            ))}
          </div>
        ) : (
          /* Google Maps View */
          <div className="h-64 sm:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <GoogleMap
              businesses={filteredBusinesses}
              userLocation={userLocation}
              selectedBusiness={selectedBusiness}
              onBusinessSelect={handleBusinessSelect}
              className="w-full h-full"
            />
          </div>
        )}

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-8 sm:py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun risultato trovato</h3>
            <p className="text-gray-600">Prova a modificare i filtri o il termine di ricerca</p>
          </div>
        )}

        {/* Show More Button */}
        {allBusinesses.length > 10 && filteredBusinesses.length === 10 && (
          <div className="text-center mt-6 sm:mt-8">
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
              Mostra altre attività
            </button>
          </div>
        )}

        {/* Legend for Map View */}
        {viewMode === 'map' && (
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Legenda Categorie</h4>
            <div className="flex flex-wrap gap-3">
              {allCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedBusiness.image} 
                alt={selectedBusiness.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedBusiness(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              {selectedBusiness.featured && (
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                  ⭐ In Evidenza
                </div>
              )}
              {userLocation && (
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 text-white px-2 py-1 sm:px-3 rounded-md text-xs sm:text-sm font-medium">
                  📍 {formatDistance(calculateDistance(userLocation, selectedBusiness.coordinates))}
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedBusiness.name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      allCategories.find(c => c.id === selectedBusiness.category)?.color || 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      {allCategories.find(c => c.id === selectedBusiness.category)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-base sm:text-lg">
                    <Star className="w-5 h-5 text-orange-400 fill-current" />
                    <span className="font-semibold">{selectedBusiness.rating}</span>
                    <span className="text-sm text-gray-500">({selectedBusiness.reviewCount} recensioni)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">{selectedBusiness.description}</p>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedBusiness.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{selectedBusiness.hours}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => handleGetDirections(selectedBusiness)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Indicazioni
                </button>
                <div className="flex gap-2 sm:gap-3">
                  <a
                    href={`tel:${selectedBusiness.phone}`}
                    className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="sm:inline">Chiama</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedBusiness.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">{allBusinesses.length}</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Attività Partner</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-700">4.7</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Rating Medio</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">650+</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Recensioni</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">100%</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Locale</div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2025 La Rete del Borgo. Connettendo comunità e commercio locale.
            </p>
          </div>
        </div>
      </footer>

      {/* Business Registration Modal */}
      <BusinessRegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        categories={allCategories}
        onSubmit={handleBusinessRegistration}
        currentUser={user}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        loading={authLoading}
        error={authError}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        currentUser={user}
      />

      {/* Manager Panel */}
      <ManagerPanel
        isOpen={showManagerPanel}
        onClose={() => setShowManagerPanel(false)}
        currentUser={user}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        onSignOut={handleSignOut}
        onShowAdminPanel={() => {
          setShowAdminPanel(true);
          setShowSidebar(false);
        }}
        onShowManagerPanel={() => {
          setShowManagerPanel(true);
          setShowSidebar(false);
        }}
        onShowBusinessDashboard={() => {
          // Trova l'attività dell'utente corrente
          const userBusiness = allBusinesses.find(b => b.owner_id === user?.id);
          if (userBusiness) {
            setSelectedBusinessForDashboard(userBusiness);
            setShowBusinessDashboard(true);
          } else {
            alert('Non hai ancora registrato nessuna attività. Registra la tua attività per accedere alla dashboard.');
          }
          setShowSidebar(false);
        }}
        onShowSettings={() => {
          setShowSettings(true);
          setShowSidebar(false);
        }}
        onShowContacts={() => {
          setShowContacts(true);
          setShowSidebar(false);
        }}
        onChangeView={setViewMode}
        currentView={viewMode}
        reviewsCount={650}
        productsCount={3}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onUpdateUser={(updates) => {
          console.log('Update user:', updates);
          // Qui implementeremo l'aggiornamento utente
        }}
        onUpdateUserType={updateUserType}
      />

      {/* Contacts Modal */}
      <ContactsModal
        isOpen={showContacts}
        onClose={() => setShowContacts(false)}
      />

      {/* Business Dashboard */}
      <BusinessDashboard
        isOpen={showBusinessDashboard}
        onClose={() => {
          setShowBusinessDashboard(false);
          setSelectedBusinessForDashboard(null);
        }}
        business={selectedBusinessForDashboard}
        currentUser={user}
      />

      {/* Digital Store */}
      <DigitalStore
        isOpen={showDigitalStore}
        onClose={() => {
          setShowDigitalStore(false);
          setSelectedBusinessForStore(null);
          setStoreInitialTab('activity');
        }}
        business={selectedBusinessForStore}
        userLocation={userLocation}
        initialTab={storeInitialTab}
      />
    </div>
  );
}

export default App;
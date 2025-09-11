import React, { useState, useEffect } from 'react';
import { MapPin, Grid, Map, Menu, User, LogIn, LogOut, UserPlus, Building2, Crown } from 'lucide-react';
import BusinessCard from './components/BusinessCard';
import GoogleMap from './components/GoogleMap';
import LocationPermissionBanner from './components/LocationPermissionBanner';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import AdminPanel from './components/AdminPanel';
import ManagerPanel from './components/ManagerPanel';
import BusinessDashboard from './components/BusinessDashboard';
import DigitalStore from './components/DigitalStore';
import ContactsModal from './components/ContactsModal';
import SettingsModal from './components/SettingsModal';
import BusinessRegistration from './components/BusinessRegistration';
import { Business, Category, UserLocation, User as UserType, BusinessRegistration as BusinessRegistrationType } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { useBusinesses } from './hooks/useBusinesses';
import { useAuth } from './hooks/useAuth';
import { calculateDistance, formatDistance } from './utils/directions';
import storageManager from './lib/storage';

const categories: Category[] = [
  { id: 'restaurant', name: 'Ristorazione', icon: '🍽️', color: 'bg-orange-400' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-orange-300' },
  { id: 'services', name: 'Servizi', icon: '🔧', color: 'bg-orange-500' },
  { id: 'wellness', name: 'Benessere', icon: '💆', color: 'bg-orange-200' },
  { id: 'professional', name: 'Professionisti', icon: '👔', color: 'bg-orange-600' },
  { id: 'culture', name: 'Cultura', icon: '🎭', color: 'bg-orange-100' }
];

function App() {
  // States
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showLocationBanner, setShowLocationBanner] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showManagerPanel, setShowManagerPanel] = useState(false);
  const [showBusinessDashboard, setShowBusinessDashboard] = useState(false);
  const [showDigitalStore, setShowDigitalStore] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBusinessRegistration, setShowBusinessRegistration] = useState(false);

  // Hooks
  const { location, loading: locationLoading, error: locationError, refetch: refetchLocation } = useGeolocation();
  const { businesses, loading, error, refetch: refetchBusinesses } = useBusinesses();
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut, updateUserType } = useAuth();

  // Force refresh function (now uses the hook's refetch)
  const forceRefresh = () => {
    console.log('🔄 FORCE REFRESH TRIGGERED FROM APP');
    refetchBusinesses();
    
    // Doppio refresh per sicurezza
    setTimeout(() => {
      console.log('🔄 SECOND REFRESH AFTER 500ms');
      refetchBusinesses();
    }, 500);
  };

  // Handle business registration
  const handleBusinessRegistration = (data: BusinessRegistrationType) => {
    console.log('📝 Registering new business:', data);
    
    try {
      const newBusiness: Business = {
        name: data.businessName,
        category: data.category,
        description: data.description,
        image: data.coverImage || data.logo || 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 0,
        reviewCount: 0,
        phone: data.phone,
        whatsapp: data.whatsapp,
        telegram: data.telegram,
        address: data.address,
        hours: Object.entries(data.hours).map(([day, hours]) => 
          hours.closed ? 'Chiuso' : `${hours.open}-${hours.close}`
        ).join(', '),
        featured: false,
        coordinates: { lat: 45.4654 + Math.random() * 0.01, lng: 9.1859 + Math.random() * 0.01 },
        businessType: data.businessType,
        appointmentBooking: data.appointmentBooking,
        owner_id: user?.id,
        created_at: new Date().toISOString(),
        // Manager can auto-approve, Business Owner needs approval
        approved: user?.user_type === 'manager',
        active: user?.user_type === 'manager',
        approval_status: user?.user_type === 'manager' ? 'approved' : 'pending'
      };

      console.log('💾 Saving business to storage:', newBusiness);
      
      // Add business to storage
      storageManager.addBusiness(newBusiness);
      
      console.log('🔄 Triggering data refresh...');
      
      // Force refresh to show new data  
      forceRefresh();
      
      // Show success message
      if (user?.user_type === 'manager') {
        console.log('✅ Manager registration - auto-approved');
        alert('✅ Attività registrata e approvata automaticamente! Ora è visibile nell\'app.');
      } else {
        console.log('✅ Business owner registration - pending approval');
        alert('✅ Attività registrata! In attesa di approvazione dal manager. Riceverai una notifica quando sarà approvata.');
      }
      
    } catch (error) {
      console.error('❌ Error registering business:', error);
      alert('❌ Errore durante la registrazione. Riprova.');
    }
  };

  // Calculate distances if user location is available
  const businessesWithDistance = businesses.map(business => {
    if (location) {
      const distance = calculateDistance(location, business.coordinates);
      return { ...business, distance };
    }
    return business;
  });

  console.log('🏠 HOMEPAGE - Total businesses received:', businesses.length);
  console.log('🏠 HOMEPAGE - Businesses data:', businesses);

  // Filter and sort businesses
  const filteredBusinesses = businessesWithDistance
    .filter(business => {
      const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      console.log(`🔍 FILTER - Business: ${business.name}, Category: ${matchesCategory}, Search: ${matchesSearch}`);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

  console.log('🏠 HOMEPAGE - Filtered businesses:', filteredBusinesses.length);
  console.log('🏠 HOMEPAGE - Filtered data:', filteredBusinesses);

  const handleLocationRequest = () => {
    refetchLocation();
    setShowLocationBanner(false);
  };

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
    setShowDigitalStore(true);
  };

  const handleGetDirections = (business: Business) => {
    const destination = `${business.coordinates.lat},${business.coordinates.lng}`;
    const origin = location ? `${location.lat},${location.lng}` : '';
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, '_blank');
  };

  const getUserBusiness = () => {
    if (!user) return null;
    return businesses.find(b => b.owner_id === user.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="w-10 h-10 bg-orange-100 hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <Menu className="w-5 h-5 text-orange-600" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">La Rete del Borgo</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Centro commerciale virtuale</p>
                </div>
              </div>
            </div>

            {/* Location Status */}
            {location && (
              <div className="hidden md:flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>Posizione attiva</span>
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-lg p-1 hidden sm:flex">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('map')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'map' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              {/* Register Business Button */}
              {user && (user.user_type === 'business_owner' || user.user_type === 'manager') && (
                <button
                  onClick={() => setShowBusinessRegistration(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Registra Attività</span>
                </button>
              )}

              {/* Manager Panel Button */}
              {user?.user_type === 'manager' && (
                <button
                  onClick={() => setShowManagerPanel(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Manager</span>
                </button>
              )}

              {/* Auth Buttons */}
              {!user ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Accedi</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                      {user.name || user.email}
                    </span>
                  </button>
                  <button
                    onClick={signOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    title="Esci"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Esci</span>
                  </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Permission Banner */}
      {showLocationBanner && !location && !locationLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <LocationPermissionBanner
            onRequestLocation={handleLocationRequest}
            onDismiss={() => setShowLocationBanner(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Scopri le migliori attività del borgo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Il tuo centro commerciale virtuale dove trovare tutto ciò di cui hai bisogno, a portata di click e vicino a casa.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cerca attività, prodotti, servizi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="all">Tutte le categorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                <option value="distance">Per vicinanza</option>
                <option value="rating">Per valutazione</option>
                <option value="name">Per nome</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tutte
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{filteredBusinesses.length} attività trovate</span>
            {location && (
              <button
                onClick={() => {/* Sort by distance */}}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <MapPin className="w-4 h-4" />
                Ordinate per distanza
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-gray-600">Caricamento attività...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={forceRefresh}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Riprova
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun risultato trovato</h3>
                <p className="text-gray-600">
                  Prova a modificare i filtri o il termine di ricerca
                </p>
              </div>
            ) : (
              <>
                {view === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBusinesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        categories={categories}
                        onSelect={handleBusinessSelect}
                        onGetDirections={handleGetDirections}
                        userLocation={location}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-96 rounded-xl overflow-hidden">
                    <GoogleMap
                      businesses={filteredBusinesses}
                      userLocation={location}
                      selectedBusiness={selectedBusiness}
                      onBusinessSelect={handleBusinessSelect}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        loading={authLoading}
        error={authError}
      />

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        onSignOut={signOut}
        onShowAdminPanel={() => setShowAdminPanel(true)}
        onShowManagerPanel={() => setShowManagerPanel(true)}
        onShowBusinessDashboard={() => setShowBusinessDashboard(true)}
        onShowSettings={() => setShowSettingsModal(true)}
        onShowContacts={() => setShowContactsModal(true)}
        onChangeView={setView}
        currentView={view}
      />

      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        currentUser={user!}
      />

      <ManagerPanel
        isOpen={showManagerPanel}
        onClose={() => setShowManagerPanel(false)}
        currentUser={user!}
        onDataChange={forceRefresh}
      />

      <BusinessDashboard
        isOpen={showBusinessDashboard}
        onClose={() => setShowBusinessDashboard(false)}
        business={getUserBusiness()}
        currentUser={user}
        onDataChange={forceRefresh}
      />

      <DigitalStore
        isOpen={showDigitalStore}
        onClose={() => setShowDigitalStore(false)}
        business={selectedBusiness}
        userLocation={location}
        businessId={selectedBusiness?.id}
      />

      <ContactsModal
        isOpen={showContactsModal}
        onClose={() => setShowContactsModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
        onUpdateUserType={updateUserType}
      />

      <BusinessRegistration
        isOpen={showBusinessRegistration}
        onClose={() => setShowBusinessRegistration(false)}
        categories={categories}
        onSubmit={handleBusinessRegistration}
        currentUser={user}
      />
    </div>
  );
}

export default App;
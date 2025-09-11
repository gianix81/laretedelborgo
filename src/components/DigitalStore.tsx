import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Navigation,
  ShoppingCart,
  Heart,
  Share2,
  Tag,
  Calendar,
  Euro,
  Package,
  Zap,
  Award,
  Users,
  CheckCircle,
  Send,
  ThumbsUp,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  Minus
} from 'lucide-react';
import { Business, Article } from '../types';
import { storageManager } from '../lib/storage';
import { openGoogleMapsDirections, calculateDistance, formatDistance } from '../utils/directions';

interface DigitalStoreProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business | null;
  userLocation?: { lat: number; lng: number } | null;
  initialTab?: 'activity' | 'reviews' | 'products';
  businessId?: string;
}

interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const DigitalStore: React.FC<DigitalStoreProps> = ({
  isOpen,
  onClose,
  business,
  userLocation,
  initialTab = 'activity',
  businessId
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'reviews' | 'products'>(initialTab);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (business && businessId) {
      const businessProducts = storageManager.getBusinessProducts(businessId);
      setProducts(businessProducts);
      
      const businessReviews = storageManager.getComments().filter(c => c.business_id === businessId);
      setReviews(businessReviews.map(c => ({
        id: c.id,
        user_name: c.user_name,
        user_avatar: c.user_avatar,
        rating: c.rating,
        comment: c.content,
        created_at: c.created_at,
        helpful_count: Math.floor(Math.random() * 10)
      })));
    }
  }, [business, businessId]);

  if (!isOpen || !business) return null;

  const mockProducts = products.length === 0 ? [
    {
      id: 'mock-1',
      title: 'Servizio Premium',
      description: 'Il nostro servizio di punta con qualità garantita e assistenza completa.',
      price: 49.99,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Servizi',
      available: true,
      rating: 4.8,
      reviews_count: 24,
      offer: {
        discountPrice: 39.99,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true
      }
    },
    {
      id: 'mock-2',
      title: 'Consulenza Specializzata',
      description: 'Consulenza personalizzata con esperti del settore per le tue esigenze specifiche.',
      price: 89.99,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Consulenza',
      available: true,
      rating: 4.9,
      reviews_count: 18
    },
    {
      id: 'mock-3',
      title: 'Pacchetto Base',
      description: 'Soluzione entry-level perfetta per iniziare con il nostro servizio.',
      price: 29.99,
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Servizi',
      available: true,
      rating: 4.5,
      reviews_count: 32
    }
  ] : products;

  const mockReviews = reviews.length === 0 ? [
    {
      id: 'review-1',
      user_name: 'Marco Rossi',
      user_avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5,
      comment: 'Servizio eccellente! Staff molto professionale e cortese. Tornerò sicuramente.',
      created_at: '2024-01-15T10:30:00Z',
      helpful_count: 8
    },
    {
      id: 'review-2',
      user_name: 'Laura Bianchi',
      user_avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4,
      comment: 'Buona qualità e prezzi onesti. Ambiente accogliente e pulito.',
      created_at: '2024-01-10T14:20:00Z',
      helpful_count: 5
    },
    {
      id: 'review-3',
      user_name: 'Giuseppe Verde',
      rating: 5,
      comment: 'Esperienza fantastica! Consigliatissimo a tutti.',
      created_at: '2024-01-08T16:45:00Z',
      helpful_count: 12
    }
  ] : reviews;

  const allProducts = mockProducts;
  const allReviews = mockReviews;
  const categories = ['all', ...new Set(allProducts.map(p => p.category))];
  
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const distance = userLocation ? calculateDistance(userLocation, business.coordinates) : null;
  const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isOfferActive = (offer: any) => {
    if (!offer) return false;
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    return now >= start && now <= end;
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          title: product.title,
          price: product.offer && isOfferActive(product.offer) ? product.offer.discountPrice : product.price,
          quantity: 1,
          image: product.image
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const handleGetDirections = () => {
    openGoogleMapsDirections(business, userLocation);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: business.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiato negli appunti!');
    }
  };

  const submitReview = () => {
    if (newReview.comment.trim()) {
      const review: Review = {
        id: `review-${Date.now()}`,
        user_name: 'Utente Anonimo',
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString(),
        helpful_count: 0
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      alert('Recensione inviata con successo!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-6xl sm:w-full sm:max-h-[95vh] sm:h-auto overflow-hidden">
        {/* Header con immagine copertina */}
        <div className="relative">
          <div className="h-48 sm:h-64 bg-gradient-to-r from-orange-400 to-orange-600 relative overflow-hidden">
            <img 
              src={business.image} 
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Pulsanti azione header */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                title="Condividi"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{business.name}</h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="text-sm">({allReviews.length} recensioni)</span>
                    </div>
                    {distance && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{formatDistance(distance)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {business.featured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    In Evidenza
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex space-x-1 sm:space-x-2">
              {[
                { id: 'activity', label: 'Attività', icon: <MapPin className="w-4 h-4" /> },
                { id: 'products', label: 'Prodotti', icon: <Package className="w-4 h-4" /> },
                { id: 'reviews', label: 'Recensioni', icon: <Star className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Cart Button */}
            {cartItemsCount > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Carrello</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(95vh-320px)] sm:max-h-[calc(95vh-280px)]">
          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Chi Siamo</h3>
                    <p className="text-gray-700 leading-relaxed">{business.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informazioni</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{business.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{business.hours}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{allProducts.length} prodotti/servizi</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Statistiche</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{allReviews.length}</div>
                        <div className="text-sm text-gray-600">Recensioni</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{allProducts.length}</div>
                        <div className="text-sm text-gray-600">Prodotti</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Contatti</h4>
                    <div className="space-y-3">
                      <button
                        onClick={handleGetDirections}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Come Arrivare
                      </button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${business.phone}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="hidden sm:inline">Chiama</span>
                        </a>
                        <a
                          href={`https://wa.me/${business.whatsapp?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>

                      {business.appointmentBooking && (
                        <button
                          onClick={() => setShowContactModal(true)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Prenota Appuntamento
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-4 sm:p-6">
              {/* Filters and Search */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cerca prodotti..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'Tutte le categorie' : category}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                      <option value="name">Per nome</option>
                      <option value="price">Per prezzo</option>
                      <option value="rating">Per rating</option>
                    </select>
                    
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun prodotto trovato</h3>
                  <p className="text-gray-600">Prova a modificare i filtri di ricerca</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => {
                    const hasActiveOffer = product.offer && isOfferActive(product.offer);
                    const isFavorite = favorites.includes(product.id);
                    const finalPrice = hasActiveOffer ? product.offer.discountPrice : product.price;
                    
                    return viewMode === 'grid' ? (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {hasActiveOffer && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              OFFERTA
                            </div>
                          )}
                          
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                          </button>

                          <div className="absolute bottom-3 right-3">
                            {product.available ? (
                              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Disponibile
                              </div>
                            ) : (
                              <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Non Disponibile
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{product.title}</h3>
                            {product.category && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2">
                                {product.category}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                          
                          {product.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">({product.reviews_count})</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {hasActiveOffer ? (
                                <>
                                  <span className="text-xl font-bold text-red-600">
                                    €{product.offer.discountPrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    €{product.price.toFixed(2)}
                                  </span>
                                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                    -{Math.round(((product.price - product.offer.discountPrice) / product.price) * 100)}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-gray-900">
                                  €{product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => addToCart(product)}
                              disabled={!product.available}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Aggiungi
                            </button>
                            <button
                              onClick={() => setShowContactModal(true)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Info
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{product.title}</h3>
                              <button
                                onClick={() => toggleFavorite(product.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                              </button>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {hasActiveOffer ? (
                                  <>
                                    <span className="text-lg font-bold text-red-600">
                                      €{product.offer.discountPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      €{product.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-gray-900">
                                    €{product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                disabled={!product.available}
                                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Aggiungi al carrello
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recensioni ({allReviews.length})
                    </h3>
                    
                    <div className="space-y-4">
                      {allReviews.map((review) => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              {review.user_avatar ? (
                                <img
                                  src={review.user_avatar}
                                  alt={review.user_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium text-sm">
                                  {review.user_name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {new Date(review.created_at).toLocaleDateString('it-IT')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <button className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                                  <ThumbsUp className="w-4 h-4" />
                                  Utile ({review.helpful_count})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Summary & Form */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Valutazione Media</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Basato su {allReviews.length} recensioni
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Scrivi una recensione</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valutazione
                        </label>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                              className="p-1"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  i < newReview.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commento
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                          placeholder="Condividi la tua esperienza..."
                        />
                      </div>
                      
                      <button
                        onClick={submitReview}
                        disabled={!newReview.comment.trim()}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Invia Recensione
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shopping Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Carrello</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Il carrello è vuoto</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                            <p className="text-orange-600 font-semibold">€{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-900">Totale:</span>
                        <span className="text-xl font-bold text-orange-600">€{cartTotal.toFixed(2)}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowCart(false);
                          setShowContactModal(true);
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contatta per Ordinare
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Contatta {business.name}</h3>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Scegli il metodo di contatto che preferisci per richiedere informazioni o effettuare un ordine.
                </p>
                
                <div className="space-y-3">
                  <a
                    href={`tel:${business.phone}`}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Chiama Ora
                  </a>
                  
                  <a
                    href={`https://wa.me/${business.whatsapp?.replace(/[^0-9]/g, '')}?text=Ciao! Sono interessato ai vostri prodotti/servizi.${cart.length > 0 ? ' Ecco il mio carrello: ' + cart.map(item => `${item.title} x${item.quantity}`).join(', ') : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Scrivi su WhatsApp
                  </a>
                  
                  {business.appointmentBooking && (
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Prenota Online
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalStore;
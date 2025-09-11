import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Navigation,
  Share2,
  Calendar,
  CheckCircle,
  Send,
  ThumbsUp
} from 'lucide-react';
import { Business } from '../types';
import { openGoogleMapsDirections, calculateDistance, formatDistance } from '../utils/directions';

interface DigitalStoreProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business | null;
  userLocation?: { lat: number; lng: number } | null;
  initialTab?: 'activity' | 'reviews';
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

const DigitalStore: React.FC<DigitalStoreProps> = ({
  isOpen,
  onClose,
  business,
  userLocation,
  initialTab = 'activity',
  businessId
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'reviews'>(initialTab);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    // Carica recensioni reali dal database quando implementato
    setReviews([]);
  }, [business, businessId]);

  if (!isOpen || !business) return null;

  const distance = userLocation ? calculateDistance(userLocation, business.coordinates) : null;
  const averageRating = business.rating || 0;

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
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[95vh] sm:h-auto overflow-hidden">
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
                      <span className="text-sm">({business.reviewCount} recensioni)</span>
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
                    ⭐ In Evidenza
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
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{business.phone}</span>
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

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recensioni ({reviews.length})
                    </h3>
                    
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">Nessuna recensione ancora</p>
                        <p className="text-sm text-gray-500">Sii il primo a lasciare una recensione!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {review.user_name.charAt(0)}
                                </span>
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
                    )}
                  </div>
                </div>

                {/* Review Form */}
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
                        Basato su {business.reviewCount} recensioni
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
                  Scegli il metodo di contatto che preferisci per richiedere informazioni o prenotare un appuntamento.
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
                    href={`https://wa.me/${business.whatsapp?.replace(/[^0-9]/g, '')}?text=Ciao! Sono interessato ai vostri servizi.`}
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
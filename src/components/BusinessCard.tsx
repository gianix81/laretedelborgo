import React from 'react';
import { Star, Phone, MessageCircle, Clock, ChevronRight, Heart, MapPin, Navigation } from 'lucide-react';
import { Business, Category } from '../types';

interface BusinessCardProps {
  business: Business;
  categories: Category[];
  onSelect: (business: Business) => void;
  onGetDirections?: (business: Business) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  categories, 
  onSelect, 
  onGetDirections,
  userLocation 
}) => {
  const category = categories.find(c => c.id === business.category);

  const calculateDistance = () => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (business.coordinates.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (business.coordinates.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(business.coordinates.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const distance = calculateDistance();

  return (
    <div
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect(business)}
    >
      <div className="relative">
        <img 
          src={business.image} 
          alt={business.name}
          className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {business.featured && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs font-semibold shadow-md">
            ⭐ In Evidenza
          </div>
        )}
        {distance && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
            📍 {distance}
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {business.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 fill-current" />
            <span className="font-medium">{business.rating}</span>
            <span className="text-gray-500 hidden sm:inline">({business.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className={`w-2 h-2 rounded-full ${category?.color || 'bg-orange-400'}`}></div>
          <span className="text-xs sm:text-sm text-gray-600">{category?.name}</span>
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{business.description}</p>
        
        <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="flex-1 line-clamp-1">{business.address}</span>
        </div>
        
        <div className="hidden sm:flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{business.hours}</span>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onGetDirections) {
                onGetDirections(business);
              }
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2"
          >
            <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Indicazioni</span>
          </button>
          <a
            href={`tel:${business.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
          <a
            href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
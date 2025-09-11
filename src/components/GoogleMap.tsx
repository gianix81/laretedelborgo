import React, { useEffect, useRef, useState } from 'react';
import { Business, UserLocation } from '../types';
import { MapPin, Navigation, Phone, MessageCircle, ZoomIn, ZoomOut } from 'lucide-react';

interface GoogleMapProps {
  businesses: Business[];
  userLocation: UserLocation | null;
  selectedBusiness: Business | null;
  onBusinessSelect: (business: Business) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  businesses,
  userLocation,
  selectedBusiness,
  onBusinessSelect,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState({ lat: 45.4642, lng: 9.1900 });
  const [selectedMarker, setSelectedMarker] = useState<Business | null>(null);

  // Update center when user location is available
  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  // Center on selected business
  useEffect(() => {
    if (selectedBusiness) {
      setCenter(selectedBusiness.coordinates);
      setZoom(18);
    }
  }, [selectedBusiness]);

  const handleMarkerClick = (business: Business) => {
    setSelectedMarker(business);
    onBusinessSelect(business);
    setCenter(business.coordinates);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 2, 20));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 2, 10));

  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenter(userLocation);
      setZoom(15);
    }
  };

  // Calculate marker positions relative to center
  const getMarkerPosition = (coords: { lat: number; lng: number }) => {
    const latDiff = (coords.lat - center.lat) * 111000; // Rough meters per degree
    const lngDiff = (coords.lng - center.lng) * 111000 * Math.cos(center.lat * Math.PI / 180);
    
    const scale = zoom / 15;
    const x = 50 + (lngDiff * scale * 0.01);
    const y = 50 - (latDiff * scale * 0.01);
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden border-2 border-gray-200"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(156, 163, 175, 0.1) 50%, transparent 51%)
          `,
          backgroundSize: '100px 100px, 150px 150px, 20px 20px'
        }}
      >
        {/* Street Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b7280" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${getMarkerPosition(userLocation).x}%`,
              top: `${getMarkerPosition(userLocation).y}%`
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* Business Markers */}
        {businesses.map((business) => {
          const position = getMarkerPosition(business.coordinates);
          const isSelected = selectedMarker?.id === business.id;
          
          return (
            <div
              key={business.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300 hover:scale-110"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`
              }}
              onClick={() => handleMarkerClick(business)}
            >
              <div className={`relative ${isSelected ? 'scale-125' : ''} transition-transform duration-300`}>
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-10 h-10 rounded-full border-3 border-white shadow-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          );
        })}

        {/* Info Window */}
        {selectedMarker && (
          <div 
            className="absolute z-30 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${getMarkerPosition(selectedMarker.coordinates).x}%`,
              top: `${getMarkerPosition(selectedMarker.coordinates).y}%`,
              marginTop: '-20px'
            }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs relative">
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>
              
              <button
                onClick={() => setSelectedMarker(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>

              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={selectedMarker.image} 
                  alt={selectedMarker.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedMarker.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-yellow-500">★</span>
                    <span>{selectedMarker.rating}</span>
                    <span className="text-gray-500">({selectedMarker.reviewCount})</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3">
                {selectedMarker.description.substring(0, 80)}...
              </p>

              <div className="flex gap-2">
                <a 
                  href={`tel:${selectedMarker.phone}`}
                  className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-medium text-center hover:bg-orange-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Chiama
                </a>
                <a 
                  href={`https://wa.me/${selectedMarker.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium text-center hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>
        {userLocation && (
          <button
            onClick={handleCenterOnUser}
            className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
            title="Vai alla mia posizione"
          >
            <Navigation className="w-4 h-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Distance Info */}
      {userLocation && selectedMarker && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-gray-200 p-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-medium">
              {selectedMarker.distance ? `${selectedMarker.distance.toFixed(1)} km` : 'Calcolando...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
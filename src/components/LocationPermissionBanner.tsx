import React from 'react';
import { MapPin, X } from 'lucide-react';

interface LocationPermissionBannerProps {
  onRequestLocation: () => void;
  onDismiss: () => void;
}

const LocationPermissionBanner: React.FC<LocationPermissionBannerProps> = ({
  onRequestLocation,
  onDismiss,
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-orange-900 mb-1">
            Attiva la geolocalizzazione
          </h3>
          <p className="text-xs sm:text-sm text-orange-700 mb-2 sm:mb-3">
            Permetti l'accesso alla tua posizione per vedere le attività più vicine e ottenere indicazioni stradali precise.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRequestLocation}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Attiva Posizione
            </button>
            <button
              onClick={onDismiss}
              className="bg-white hover:bg-gray-50 text-orange-600 border border-orange-200 px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Non ora
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 hover:text-orange-600 transition-colors flex-shrink-0"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default LocationPermissionBanner;
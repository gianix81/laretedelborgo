import { Business, UserLocation } from '../types';

export const openGoogleMapsDirections = (business: Business, userLocation?: UserLocation | null) => {
  const destination = `${business.coordinates.lat},${business.coordinates.lng}`;
  const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
  
  const baseUrl = 'https://www.google.com/maps/dir/';
  const url = `${baseUrl}${origin}/${destination}`;
  
  window.open(url, '_blank');
};

export const calculateDistance = (
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatDistance = (distance: number): string => {
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
};
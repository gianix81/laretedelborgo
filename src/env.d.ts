/// <reference types="vite/client" />

declare global {
  interface Window {
    google: typeof google;
  }
}

// Google Maps types
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      panTo(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: () => void): void;
    }

    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      setContent(content: string): void;
      open(map: Map, anchor?: Marker): void;
      close(): void;
    }

    interface MapOptions {
      zoom: number;
      center: LatLng | LatLngLiteral;
      styles?: MapTypeStyle[];
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      title?: string;
      icon?: string | Icon | Symbol;
    }

    interface InfoWindowOptions {
      content?: string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface Icon {
      url: string;
      scaledSize: Size;
      origin: Point;
      anchor: Point;
    }

    interface Symbol {
      path: SymbolPath;
      scale: number;
      fillColor: string;
      fillOpacity: number;
      strokeColor: string;
      strokeWeight: number;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    enum SymbolPath {
      CIRCLE = 0,
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers: Array<{ [key: string]: string }>;
    }
  }
}

export {};
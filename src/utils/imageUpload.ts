// Utility per gestione upload immagini locali
export interface ImageUploadResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

export const uploadImage = (file: File): Promise<ImageUploadResult> => {
  return new Promise((resolve) => {
    // Validazione tipo file
    if (!file.type.startsWith('image/')) {
      resolve({
        success: false,
        error: 'Il file selezionato non è un\'immagine valida'
      });
      return;
    }

    // Validazione dimensione (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      resolve({
        success: false,
        error: 'L\'immagine è troppo grande. Dimensione massima: 5MB'
      });
      return;
    }

    // Conversione in base64
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      resolve({
        success: true,
        dataUrl
      });
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Errore durante il caricamento dell\'immagine'
      });
    };

    reader.readAsDataURL(file);
  });
};

export const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<ImageUploadResult> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcola nuove dimensioni mantenendo aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Disegna immagine ridimensionata
      ctx?.drawImage(img, 0, 0, width, height);

      // Converti in base64
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      resolve({
        success: true,
        dataUrl
      });
    };

    img.onerror = () => {
      resolve({
        success: false,
        error: 'Errore durante il ridimensionamento dell\'immagine'
      });
    };

    // Carica immagine
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Componente per upload immagini
export interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (dataUrl: string | null) => void;
  className?: string;
  placeholder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}
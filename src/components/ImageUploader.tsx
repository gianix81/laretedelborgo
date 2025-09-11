import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadImage, resizeImage, ImageUploadResult } from '../utils/imageUpload';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (dataUrl: string | null) => void;
  className?: string;
  placeholder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  required?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  className = '',
  placeholder = 'Carica immagine',
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Ridimensiona e ottimizza l'immagine
      const result: ImageUploadResult = await resizeImage(file, maxWidth, maxHeight, quality);
      
      if (result.success && result.dataUrl) {
        onImageChange(result.dataUrl);
      } else {
        setError(result.error || 'Errore durante il caricamento');
      }
    } catch (err) {
      setError('Errore durante il caricamento dell\'immagine');
    } finally {
      setUploading(false);
      // Reset input per permettere ricaricamento stesso file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        required={required}
      />

      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Immagine caricata"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Cambia
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Rimuovi
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-gray-600">Caricamento...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">{placeholder}</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF fino a 5MB</p>
              <div className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Seleziona File
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>• Formati supportati: PNG, JPG, GIF</p>
        <p>• Dimensione massima: 5MB</p>
        <p>• L'immagine verrà automaticamente ridimensionata e ottimizzata</p>
      </div>
    </div>
  );
};

export default ImageUploader;
import React, { useState } from 'react';
import { X, Plus, Trash2, Clock, MapPin, Phone, MessageCircle, Send, Calendar, Euro } from 'lucide-react';
import { BusinessRegistration, BusinessHours, Article, Category } from '../types';
import ImageUploader from './ImageUploader';
import storageManager from '../lib/storage';

interface BusinessRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: BusinessRegistration) => void;
  currentUser?: any;
}

const defaultHours: BusinessHours = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '09:00', close: '13:00', closed: false },
  sunday: { open: '09:00', close: '18:00', closed: true },
};

const BusinessRegistrationModal: React.FC<BusinessRegistrationProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
  currentUser,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    authorization: false,
    content: false,
    moderation: false
  });
  const [formData, setFormData] = useState<BusinessRegistration>({
    businessName: '',
    ownerName: '',
    vatNumber: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    whatsapp: '',
    telegram: '',
    category: '',
    businessType: 'shop',
    description: '',
    logo: null,
    coverImage: null,
    hours: defaultHours,
    appointmentBooking: false,
    articles: [],
  });

  const [currentArticle, setCurrentArticle] = useState<Omit<Article, 'id' | 'businessId' | 'createdAt'>>({
    title: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    available: true,
  });

  if (!isOpen) return null;

  const handleInputChange = (field: keyof BusinessRegistration, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (day: keyof BusinessHours, field: keyof BusinessHours[keyof BusinessHours], value: any) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };

  const addArticle = () => {
    if (currentArticle.title && currentArticle.description && currentArticle.price > 0) {
      setFormData(prev => ({
        ...prev,
        articles: [...prev.articles, { ...currentArticle }],
      }));
      setCurrentArticle({
        title: '',
        description: '',
        price: 0,
        images: [],
        category: '',
        available: true,
      });
    }
  };

  const removeArticle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter((_, i) => i !== index),
    }));
  };

  const addImageToArticle = (url: string) => {
    if (currentArticle.images.length < 4 && url) {
      setCurrentArticle(prev => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImageFromArticle = (index: number) => {
    setCurrentArticle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // Validazione consensi
    const missingConsents = [];
    if (!consents.terms) missingConsents.push('Termini di Servizio');
    if (!consents.privacy) missingConsents.push('Privacy Policy');
    if (!consents.authorization) missingConsents.push('Autorizzazione legale');
    if (!consents.content) missingConsents.push('Dichiarazione contenuti');
    if (!consents.moderation) missingConsents.push('Moderazione contenuti');
    
    if (missingConsents.length > 0) {
      alert(`Devi accettare tutti i consensi obbligatori. Mancano: ${missingConsents.join(', ')}`);
      return;
    }
    
    // Validazione aggiuntiva per business owners (non per manager)
    if (currentUser?.user_type === 'business_owner') {
      const existingBusiness = storageManager.getBusinesses().find(b => b.owner_id === currentUser.id);
      if (existingBusiness) {
        alert('Hai già registrato un\'attività. I titolari possono gestire solo una attività per account.');
        return;
      }
    }
    
    onSubmit(formData);
    onClose();
  };

  const steps = [
    { number: 1, title: 'Dati Anagrafici', description: 'Informazioni base dell\'attività' },
    { number: 2, title: 'Dettagli Attività', description: 'Categoria e descrizione' },
    { number: 3, title: 'Orari e Servizi', description: 'Orari di apertura e servizi' },
    { number: 4, title: 'Articoli/Prodotti', description: 'Gestione catalogo prodotti' },
    { number: 5, title: 'Riepilogo', description: 'Conferma e invio' },
  ];

  const dayNames = {
    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Registra la tua Attività</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    currentStep >= step.number 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${
                      currentStep >= step.number ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Progress */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Passo {currentStep} di {steps.length}</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {/* Step 1: Dati Anagrafici */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Dati Anagrafici</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Nome Attività *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Es. Trattoria da Mario"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Nome Titolare *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Mario Rossi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partita IVA
                  </label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="12345678901"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="mario@trattoria.it"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="+39 0123 456789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="+39 333 1234567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram (opzionale)
                  </label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => handleInputChange('telegram', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="@username_telegram"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indirizzo Completo *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Via Roma 15, 20121 Milano"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Città *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Milano"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CAP *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="20121"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dettagli Attività */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dettagli Attività</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="">Seleziona categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo Attività *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="shop">Negozio/Commercio</option>
                    <option value="professional">Professionista</option>
                    <option value="service">Agenzia di Servizi</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrizione Attività *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Descrivi la tua attività, i servizi offerti e cosa ti rende unico..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Attività
                  </label>
                  <ImageUploader
                    currentImage={formData.logo}
                    onImageChange={(dataUrl) => handleInputChange('logo', dataUrl)}
                    placeholder="Carica logo attività"
                    maxWidth={300}
                    maxHeight={300}
                    quality={0.9}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Immagine Copertina
                  </label>
                  <ImageUploader
                    currentImage={formData.coverImage}
                    onImageChange={(dataUrl) => handleInputChange('coverImage', dataUrl)}
                    placeholder="Carica immagine copertina"
                    maxWidth={800}
                    maxHeight={400}
                    quality={0.8}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Orari e Servizi */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orari e Servizi</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Orari di Apertura
                </h4>
                
                <div className="space-y-3">
                  {Object.entries(dayNames).map(([day, dayName]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-gray-700">
                        {dayName}
                      </div>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.hours[day as keyof BusinessHours].closed}
                          onChange={(e) => handleHoursChange(day as keyof BusinessHours, 'closed', e.target.checked)}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                        />
                        <span className="text-sm text-gray-600">Chiuso</span>
                      </label>
                      
                      {!formData.hours[day as keyof BusinessHours].closed && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={formData.hours[day as keyof BusinessHours].open}
                            onChange={(e) => handleHoursChange(day as keyof BusinessHours, 'open', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={formData.hours[day as keyof BusinessHours].close}
                            onChange={(e) => handleHoursChange(day as keyof BusinessHours, 'close', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {formData.businessType === 'professional' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.appointmentBooking}
                      onChange={(e) => handleInputChange('appointmentBooking', e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Abilita Prenotazione Appuntamenti
                      </div>
                      <div className="text-sm text-gray-600">
                        I clienti potranno prenotare appuntamenti direttamente dall'app
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Articoli/Prodotti */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Articoli e Prodotti</h3>
              
              {/* Add New Article */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Aggiungi Nuovo Articolo</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Articolo
                    </label>
                    <input
                      type="text"
                      value={currentArticle.title}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Es. Pizza Margherita"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prezzo (€)
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={currentArticle.price}
                        onChange={(e) => setCurrentArticle(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        placeholder="12.50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    value={currentArticle.description}
                    onChange={(e) => setCurrentArticle(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Descrivi l'articolo, ingredienti, caratteristiche..."
                  />
                </div>
                
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Immagini Articolo (max 4)
                  </label>
                  
                  <div className="space-y-3">
                    {currentArticle.images.map((image, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Immagine ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageFromArticle(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {currentArticle.images.length < 4 && (
                      <ImageUploader
                        currentImage={null}
                        onImageChange={(dataUrl) => {
                          if (dataUrl) addImageToArticle(dataUrl);
                        }}
                        placeholder={`Aggiungi immagine ${currentArticle.images.length + 1}/4`}
                        maxWidth={400}
                        maxHeight={300}
                        quality={0.8}
                      />
                    )}
                  </div>
                </div>
                
                <button
                  onClick={addArticle}
                  disabled={!currentArticle.title || !currentArticle.description || currentArticle.price <= 0}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi Articolo
                </button>
              </div>
              
              {/* Articles List */}
              {formData.articles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Articoli Aggiunti ({formData.articles.length})</h4>
                  <div className="space-y-3">
                    {formData.articles.map((article, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {article.images[0] && (
                                <img
                                  src={article.images[0]}
                                  alt={article.title}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <h5 className="font-medium text-gray-900">{article.title}</h5>
                                <p className="text-sm text-gray-600">€{article.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{article.description}</p>
                            {article.images.length > 1 && (
                              <p className="text-xs text-gray-500 mt-1">
                                +{article.images.length - 1} altre immagini
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeArticle(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Riepilogo */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Riepilogo Registrazione</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Dati Attività</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nome:</span> {formData.businessName}</p>
                      <p><span className="font-medium">Titolare:</span> {formData.ownerName}</p>
                      <p><span className="font-medium">Categoria:</span> {categories.find(c => c.id === formData.category)?.name}</p>
                      <p><span className="font-medium">Tipo:</span> {
                        formData.businessType === 'shop' ? 'Negozio/Commercio' :
                        formData.businessType === 'professional' ? 'Professionista' : 'Agenzia di Servizi'
                      }</p>
                      <p><span className="font-medium">Indirizzo:</span> {formData.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Contatti</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Email:</span> {formData.email}</p>
                      <p><span className="font-medium">Telefono:</span> {formData.phone}</p>
                      <p><span className="font-medium">WhatsApp:</span> {formData.whatsapp}</p>
                      {formData.telegram && (
                        <p><span className="font-medium">Telegram:</span> {formData.telegram}</p>
                      )}
                      {formData.appointmentBooking && (
                        <p className="text-blue-600 font-medium">✓ Prenotazioni abilitate</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {formData.articles.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Articoli Aggiunti ({formData.articles.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.articles.map((article, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {article.images[0] && (
                              <img
                                src={article.images[0]}
                                alt={article.title}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{article.title}</p>
                              <p className="text-sm text-orange-600">€{article.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Piano di Abbonamento</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Primo mese gratuito, poi €2/mese per il piano base. Potrai sempre aggiornare al piano Professionista (€10/mese) per funzionalità avanzate.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <span className="font-medium">✓ Profilo completo</span>
                  <span className="font-medium">✓ Gestione articoli</span>
                  <span className="font-medium">✓ Contatti diretti</span>
                </div>
              </div>
              
              {/* Terms and Responsibilities */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-3">
                  ⚠️ Responsabilità e Termini di Utilizzo
                </h4>
                <div className="text-sm text-red-800 space-y-2">
                  <p className="font-medium">Registrando la mia attività, mi impegno a:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Fornire informazioni veritiere e aggiornate</li>
                    <li>Non pubblicare contenuti illegali, offensivi o discriminatori</li>
                    <li>Non utilizzare immagini protette da copyright</li>
                    <li>Non pubblicare contenuti a carattere sessuale esplicito</li>
                    <li>Non promuovere vendita di armi, droghe o sostanze illegali</li>
                    <li>Rispettare tutte le normative vigenti per la mia categoria</li>
                    <li>Mantenere aggiornati prezzi, orari e disponibilità</li>
                    <li>Non pubblicare contenuti razzisti, discriminatori o che incitino all'odio</li>
                    <li>Non utilizzare linguaggio volgare o offensivo nelle descrizioni</li>
                    <li>Non pubblicare informazioni false o ingannevoli sui prodotti/servizi</li>
                    <li>Non violare i diritti di proprietà intellettuale di terzi</li>
                    <li>Rispettare la dignità delle persone in tutte le comunicazioni</li>
                  </ul>
                  <p className="font-medium text-red-900 mt-3 p-2 bg-red-100 rounded border border-red-300">
                    La violazione di queste regole comporterà la sospensione immediata dell'account, la rimozione di tutti i contenuti pubblicati e possibili azioni legali. L'azienda si riserva il diritto di segnalare alle autorità competenti eventuali contenuti illegali.
                  </p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consents.terms}
                      onChange={(e) => setConsents(prev => ({ ...prev, terms: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">
                      Accetto i{' '}
                      <a href="#" className="text-orange-600 hover:text-orange-700 underline">
                        Termini di Servizio
                      </a>{' '}
                      e mi assumo la piena responsabilità dei contenuti pubblicati *
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consents.privacy}
                      onChange={(e) => setConsents(prev => ({ ...prev, privacy: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">
                      Accetto la{' '}
                      <a href="#" className="text-orange-600 hover:text-orange-700 underline">
                        Privacy Policy
                      </a>{' '}
                      e autorizzo il trattamento dei dati per finalità commerciali *
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consents.authorization}
                      onChange={(e) => setConsents(prev => ({ ...prev, authorization: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">
                      Confermo di essere autorizzato a rappresentare legalmente l'attività e di avere tutti i diritti necessari per la pubblicazione dei contenuti *
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consents.content}
                      onChange={(e) => setConsents(prev => ({ ...prev, content: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">
                      Dichiaro di non pubblicare contenuti che violino le leggi vigenti, inclusi ma non limitati a: contenuti razzisti, discriminatori, sessualmente espliciti, che promuovano violenza, armi, droghe o altre sostanze illegali *
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consents.moderation}
                      onChange={(e) => setConsents(prev => ({ ...prev, moderation: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">
                      Comprendo che tutti i contenuti pubblicati saranno soggetti a moderazione e che la piattaforma si riserva il diritto di rimuovere immediatamente qualsiasi contenuto ritenuto inappropriato *
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Indietro
            </button>
            
            <div className="text-sm text-gray-500">
              Passo {currentStep} di {steps.length}
            </div>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Continua
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Registra Attività
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationModal;
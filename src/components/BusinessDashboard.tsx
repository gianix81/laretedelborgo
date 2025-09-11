import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Edit3, 
  Eye, 
  Star, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Plus,
  Trash2,
  Save,
  TrendingUp,
  Users,
  Calendar,
  Euro,
  Tag,
  AlertCircle,
  CheckCircle,
  Package,
  Send
} from 'lucide-react';
import { Business, Article } from '../types';
import { storageManager } from '../lib/storage';
import ImageUploader from './ImageUploader';

interface BusinessDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  business?: Business | null;
  onUpdateBusiness?: (updates: Partial<Business>) => void;
  currentUser?: any;
  onDataChange?: () => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  isOpen,
  onClose,
  business,
  onUpdateBusiness,
  currentUser,
  onDataChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'analytics' | 'settings'>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: 0,
    image: null as string | null,
    category: '',
    hasOffer: false,
    discountPrice: 0,
    startDate: '',
    endDate: ''
  });

  if (!isOpen || !business) return null;

  // Mock business se non fornito
  const currentBusiness = business || {
    id: 'mock-business',
    name: 'La Mia Attività',
    category: 'restaurant',
    description: 'Descrizione della mia attività',
    image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    reviewCount: 23,
    phone: '+39 0123 456789',
    whatsapp: '+39 333 1234567',
    address: 'Via Roma 15, 20121 Milano',
    hours: '9:00-18:00',
    featured: false,
    coordinates: { lat: 45.4654, lng: 9.1859 },
    businessType: 'shop' as const,
    appointmentBooking: false
  };

  // Mock data for demonstration
  const mockProducts = [
    {
      id: 1,
      title: 'Pizza Margherita',
      description: 'Pizza classica con pomodoro, mozzarella e basilico',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
      category: 'Pizza',
      offer: {
        discountPrice: 6.50,
        startDate: '2024-01-15',
        endDate: '2024-01-31'
      }
    },
    {
      id: 2,
      title: 'Pasta Carbonara',
      description: 'Pasta con uova, guanciale e pecorino romano',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
      category: 'Pasta'
    }
  ];

  const mockAnalytics = {
    views: 1250,
    clicks: 89,
    conversions: 12,
    revenue: 450.00
  };

  // Handle product form submission
  const handleProductSubmit = () => {
    if (!productForm.title || !productForm.description || productForm.price <= 0 || !productForm.image) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    if (editingProduct) {
      // Update existing product
      console.log('Updating product:', { ...productForm, id: editingProduct.id });
    } else {
      // Create new product
      console.log('Creating new product:', productForm);
    }

    // Reset form
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      price: 0,
      image: null,
      category: '',
      hasOffer: false,
      discountPrice: 0,
      startDate: '',
      endDate: ''
    });
    
    alert(editingProduct ? 'Prodotto aggiornato!' : 'Prodotto aggiunto!');
  };

  // Handle product edit
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      hasOffer: !!product.offer,
      discountPrice: product.offer?.discountPrice || 0,
      startDate: product.offer?.startDate || '',
      endDate: product.offer?.endDate || ''
    });
    setShowProductForm(true);
  };

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: <Store className="w-4 h-4" /> },
    { id: 'products', label: 'Prodotti', icon: <Package className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'settings', label: 'Impostazioni', icon: <Edit3 className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-6xl sm:w-full sm:max-h-[95vh] sm:h-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Dashboard Business</h2>
              <p className="text-green-100 text-sm sm:text-base">{currentBusiness.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row h-[calc(100vh-80px)] sm:h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-full sm:w-64 bg-gray-50 border-b sm:border-r sm:border-b-0 border-gray-200 p-3 sm:p-4 overflow-x-auto sm:overflow-x-visible">
            <nav className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 min-w-max sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 sm:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Panoramica Business</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>Ultimo aggiornamento: oggi</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{mockAnalytics.views}</div>
                        <div className="text-sm text-blue-600">Visualizzazioni</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-900">{mockAnalytics.clicks}</div>
                        <div className="text-sm text-green-600">Click</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-900">{mockAnalytics.conversions}</div>
                        <div className="text-sm text-orange-600">Conversioni</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Euro className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-900">€{mockAnalytics.revenue}</div>
                        <div className="text-sm text-purple-600">Ricavi</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Stato Attività</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Stato Approvazione:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        business.approval_status === 'approved' || business.approved === true
                          ? 'bg-green-100 text-green-700'
                          : business.approval_status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {(business.approval_status === 'approved' || business.approved === true) ? '✅ Approvata' :
                         business.approval_status === 'rejected' ? '❌ Rifiutata' : '⏳ In Attesa'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Visibilità:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        business.active !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {business.active !== false ? '👁️ Visibile' : '🚫 Non Visibile'}
                      </span>
                    </div>
                    
                    {business.approval_status === 'rejected' && business.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="font-medium text-red-900 mb-1">Motivo Rifiuto:</h5>
                        <p className="text-sm text-red-700">{business.rejection_reason}</p>
                      </div>
                    )}
                    
                    {business.approval_status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-700">
                          La tua attività è in attesa di approvazione. Il nostro team la esaminerà entro 24-48 ore.
                        </p>
                      </div>
                    )}
                    
                    {(business.approval_status === 'approved' || business.approved === true) && business.active === false && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          La tua attività è approvata ma non ancora attiva. Contatta il supporto per l'attivazione.
                        </p>
                      </div>
                    )}
                    
                    {(business.approval_status === 'approved' || business.approved === true) && business.active === true && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700">
                          ✅ La tua attività è approvata e visibile nell'app! I clienti possono trovarti e contattarti.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Informazioni Business</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{business.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{business.phone || 'Non specificato'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Lun-Dom: 9:00-22:00</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">4.5/5 (23 recensioni)</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Attività Recente</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Nuovo prodotto aggiunto</div>
                        <div className="text-sm text-green-600">Pizza Margherita - 2 ore fa</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Nuova recensione ricevuta</div>
                        <div className="text-sm text-blue-600">5 stelle da Marco R. - 1 giorno fa</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Gestione Prodotti</h3>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        title: '',
                        description: '',
                        price: 0,
                        image: null,
                        category: '',
                        hasOffer: false,
                        discountPrice: 0,
                        startDate: '',
                        endDate: ''
                      });
                      setShowProductForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Aggiungi Prodotto
                  </button>
                </div>

                {/* Product Form Modal */}
                {showProductForm && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xl font-semibold text-gray-900">
                            {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
                          </h4>
                          <button
                            onClick={() => {
                              setShowProductForm(false);
                              setEditingProduct(null);
                              setProductForm({
                                title: '',
                                description: '',
                                price: 0,
                                image: null,
                                category: '',
                                hasOffer: false,
                                discountPrice: 0,
                                startDate: '',
                                endDate: ''
                              });
                            }}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Prodotto *
                              </label>
                              <input
                                type="text"
                                value={productForm.title}
                                onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                placeholder="Es. Pizza Margherita"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoria
                              </label>
                              <select
                                value={productForm.category}
                                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                              >
                                <option value="">Seleziona categoria</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Antipasti">Antipasti</option>
                                <option value="Dolci">Dolci</option>
                                <option value="Bevande">Bevande</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descrizione *
                            </label>
                            <textarea
                              value={productForm.description}
                              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                              placeholder="Descrivi il tuo prodotto..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prezzo (€) *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={productForm.price}
                                onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                placeholder="0.00"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Immagine Prodotto *
                              </label>
                              <ImageUploader
                                currentImage={productForm.image}
                                onImageChange={(dataUrl) => setProductForm(prev => ({ ...prev, image: dataUrl }))}
                                placeholder="Carica immagine prodotto"
                                maxWidth={600}
                                maxHeight={400}
                                quality={0.8}
                                required
                              />
                            </div>
                          </div>

                          {/* Offer Section */}
                          <div className="border-t pt-4">
                            <div className="flex items-center gap-3 mb-4">
                              <input
                                type="checkbox"
                                id="hasOffer"
                                checked={productForm.hasOffer}
                                onChange={(e) => setProductForm(prev => ({ ...prev, hasOffer: e.target.checked }))}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <label htmlFor="hasOffer" className="text-sm font-medium text-gray-700">
                                Aggiungi offerta speciale
                              </label>
                            </div>

                            {productForm.hasOffer && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prezzo Scontato (€)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={productForm.discountPrice}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, discountPrice: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Inizio
                                  </label>
                                  <input
                                    type="date"
                                    value={productForm.startDate}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Fine
                                  </label>
                                  <input
                                    type="date"
                                    value={productForm.endDate}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                          <button
                            onClick={() => {
                              setShowProductForm(false);
                              setEditingProduct(null);
                              setProductForm({
                                title: '',
                                description: '',
                                price: 0,
                                image: null,
                                category: '',
                                hasOffer: false,
                                discountPrice: 0,
                                startDate: '',
                                endDate: ''
                              });
                            }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={handleProductSubmit}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {editingProduct ? 'Aggiorna' : 'Salva'} Prodotto
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        {product.offer && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                            -€{(product.price - product.offer.discountPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{product.title}</h4>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.offer ? (
                              <>
                                <span className="text-lg font-bold text-red-600">€{product.offer.discountPrice.toFixed(2)}</span>
                                <span className="text-sm text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                            )}
                          </div>
                          
                          {product.category && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {product.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Analytics e Statistiche</h3>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Panoramica Mensile</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{mockAnalytics.views}</div>
                      <div className="text-sm text-gray-600">Visualizzazioni Totali</div>
                      <div className="text-xs text-green-600 mt-1">+12% vs mese scorso</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{mockAnalytics.clicks}</div>
                      <div className="text-sm text-gray-600">Click sui Prodotti</div>
                      <div className="text-xs text-green-600 mt-1">+8% vs mese scorso</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{mockAnalytics.conversions}</div>
                      <div className="text-sm text-gray-600">Conversioni</div>
                      <div className="text-xs text-red-600 mt-1">-3% vs mese scorso</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">€{mockAnalytics.revenue}</div>
                      <div className="text-sm text-gray-600">Ricavi Stimati</div>
                      <div className="text-xs text-green-600 mt-1">+15% vs mese scorso</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Prodotti più Popolari</h4>
                  <div className="space-y-3">
                    {mockProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                            {index + 1}
                          </div>
                          <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <div className="font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-600">€{product.price.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{Math.floor(Math.random() * 50) + 10} views</div>
                          <div className="text-sm text-gray-600">{Math.floor(Math.random() * 10) + 1} click</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Impostazioni Business</h3>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Informazioni Generali</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome Business</label>
                      <input
                        type="text"
                        defaultValue={business.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent">
                        <option value={business.category}>{business.category}</option>
                        <option value="Ristorante">Ristorante</option>
                        <option value="Bar">Bar</option>
                        <option value="Negozio">Negozio</option>
                        <option value="Servizi">Servizi</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                      <textarea
                        rows={3}
                        defaultValue={business.description}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Contatti e Posizione</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                      <input
                        type="tel"
                        defaultValue={business.phone}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        placeholder="business@esempio.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
                      <input
                        type="text"
                        defaultValue={currentBusiness.address}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Orari di Apertura</h4>
                  <div className="space-y-3">
                    {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'].map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-gray-700">{day}</div>
                        <input
                          type="time"
                          defaultValue="09:00"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          defaultValue="22:00"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                          <span className="text-sm text-gray-600">Chiuso</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Chiudi
            </button>
            {activeTab === 'settings' && (
              <button 
                onClick={handleBusinessUpdate}
                className="px-4 sm:px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Invia per Approvazione</span>
                <span className="sm:hidden">Invia</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Pending Changes Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Send className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Modifiche Inviate</h3>
                  <p className="text-sm text-gray-600">In attesa di approvazione</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Le tue modifiche sono state inviate al manager per l'approvazione. 
                Riceverai una notifica quando saranno elaborate.
              </p>
              
              <button
                onClick={() => setShowPendingModal(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Ho Capito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
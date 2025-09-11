import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Bell, Lock, Palette, Globe, Save, Edit3, Upload } from 'lucide-react';
import { User as UserType } from '../types';
import ImageUploader from './ImageUploader';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onUpdateUser?: (updates: Partial<UserType>) => void;
  onUpdateUserType?: (newUserType: 'customer' | 'business_owner') => Promise<{ success: boolean; error?: string }>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onUpdateUserType
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy' | 'notifications'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
    user_type: user?.user_type || 'customer'
  });
  const [changingUserType, setChangingUserType] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    onUpdateUser?.(formData);
    onClose();
    alert('Impostazioni salvate con successo!');
  };

  const handleUserTypeChange = async (newUserType: 'customer' | 'business_owner') => {
    if (!onUpdateUserType) return;
    
    setChangingUserType(true);
    const result = await onUpdateUserType(newUserType);
    setChangingUserType(false);
    
    if (result.success) {
      setFormData(prev => ({ ...prev, user_type: newUserType }));
      alert('Tipo di account aggiornato con successo!');
    } else {
      alert('Errore nell\'aggiornamento del tipo di account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profilo', icon: <User className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <Mail className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifiche', icon: <Bell className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Impostazioni</h2>
              <p className="text-orange-100 text-sm sm:text-base">Gestisci il tuo account e le preferenze</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row h-[calc(100vh-80px)] sm:h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-full sm:w-64 bg-gray-50 border-b sm:border-r sm:border-b-0 border-gray-200 p-3 sm:p-4 overflow-x-auto sm:overflow-x-visible">
            <nav className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 min-w-max sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 sm:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Informazioni Profilo</h3>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Foto Profilo
                  </label>
                  <ImageUploader
                    currentImage={user.avatar_url}
                    onImageChange={(dataUrl) => {
                      // Qui implementeremo l'aggiornamento dell'avatar
                      console.log('New avatar:', dataUrl);
                    }}
                    placeholder="Carica foto profilo"
                    maxWidth={300}
                    maxHeight={300}
                    quality={0.9}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                      placeholder="+39 333 1234567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Indirizzo
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                      placeholder="Via Roma 15, Milano"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Biografia
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Raccontaci qualcosa di te..."
                  />
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Impostazioni Account</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Tipo di Account</h4>
                  
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Account attuale:</strong> {user.user_type === 'customer' ? 'Cliente' : 
                       user.user_type === 'business_owner' ? 'Esercente/Professionista' : 
                       user.user_type === 'admin' ? 'Amministratore' : 'Manager'}
                    </p>
                    {user.user_type === 'customer' && (
                      <p className="text-xs text-blue-600 mt-1">
                        Per registrare un'attività devi passare ad account Esercente/Professionista
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className={`p-3 sm:p-4 border rounded-lg transition-colors ${
                      user.user_type === 'customer' ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm sm:text-base">Cliente</div>
                            <div className="text-xs sm:text-sm text-gray-600">Esplora e scopri attività locali</div>
                          </div>
                        </div>
                        {user.user_type !== 'customer' && (
                          <button
                            onClick={() => handleUserTypeChange('customer')}
                            disabled={changingUserType}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            {changingUserType ? 'Cambiando...' : 'Passa a Cliente'}
                          </button>
                        )}
                        {user.user_type === 'customer' && (
                          <span className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium">
                            Attuale
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`p-3 sm:p-4 border rounded-lg transition-colors ${
                      user.user_type === 'business_owner' ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                            <span className="text-orange-600 text-xs font-bold">B</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Esercente/Professionista</div>
                            <div className="text-sm text-gray-600">Gestisci la tua attività commerciale</div>
                          </div>
                        </div>
                        {user.user_type !== 'business_owner' && (
                          <button
                            onClick={() => handleUserTypeChange('business_owner')}
                            disabled={changingUserType}
                            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            {changingUserType ? 'Cambiando...' : 'Passa a Business'}
                          </button>
                        )}
                        {user.user_type === 'business_owner' && (
                          <span className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium">
                            Attuale
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {(user.user_type === 'admin' || user.user_type === 'manager') && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium text-purple-900 mb-2">Account Privilegiato</h4>
                    <p className="text-xs sm:text-sm text-purple-700">
                      Il tuo account ha privilegi speciali di {user.user_type === 'admin' ? 'Amministratore' : 'Manager'} 
                      e non può essere modificato.
                    </p>
                  </div>
                )}
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-red-900 mb-2">Zona Pericolosa</h4>
                  <p className="text-xs sm:text-sm text-red-700 mb-4">
                    Queste azioni sono irreversibili. Procedi con cautela.
                  </p>
                  <div className="space-y-2">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                      Elimina Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Privacy e Sicurezza</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Profilo Pubblico</div>
                      <div className="text-xs sm:text-sm text-gray-600">Rendi visibile il tuo profilo agli altri utenti</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Geolocalizzazione</div>
                      <div className="text-xs sm:text-sm text-gray-600">Permetti l'accesso alla tua posizione</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Dati di Utilizzo</div>
                      <div className="text-xs sm:text-sm text-gray-600">Condividi dati anonimi per migliorare l'app</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Preferenze Notifiche</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Nuove Attività</div>
                      <div className="text-xs sm:text-sm text-gray-600">Ricevi notifiche per nuove attività nella tua zona</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Offerte Speciali</div>
                      <div className="text-xs sm:text-sm text-gray-600">Ricevi notifiche per sconti e promozioni</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Email Marketing</div>
                      <div className="text-xs sm:text-sm text-gray-600">Ricevi newsletter e aggiornamenti via email</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
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
              Annulla
            </button>
            <button
              onClick={handleSave}
              className="px-4 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Salva Modifiche</span>
              <span className="sm:hidden">Salva</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
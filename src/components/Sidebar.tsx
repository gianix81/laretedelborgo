import React, { useState } from 'react';
import { 
  X, 
  User, 
  Settings, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Grid, 
  Map, 
  Shield, 
  Crown, 
  LogOut,
  ChevronRight,
  Edit3,
  Bell,
  Heart,
  Star,
  MessageCircle,
  HelpCircle,
  FileText,
  Lock,
  Palette,
  Globe,
  Smartphone
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSignOut: () => void;
  onShowAdminPanel?: () => void;
  onShowManagerPanel?: () => void;
  onShowBusinessDashboard?: () => void;
  onShowSettings?: () => void;
  onShowContacts?: () => void;
  onChangeView?: (view: 'grid' | 'map') => void;
  currentView?: 'grid' | 'map';
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  onShowAdminPanel,
  onShowManagerPanel,
  onShowBusinessDashboard,
  onShowSettings,
  onShowContacts,
  onChangeView,
  currentView = 'grid',
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMenuClick = (action: () => void, sectionId?: string) => {
    if (sectionId) {
      setActiveSection(activeSection === sectionId ? null : sectionId);
    } else {
      action();
      onClose();
    }
  };

  const menuSections = [
    {
      id: 'navigation',
      title: 'Navigazione',
      items: [
        {
          icon: <Grid className="w-5 h-5" />,
          label: 'Vista Griglia',
          action: () => onChangeView?.('grid'),
          active: currentView === 'grid'
        },
        {
          icon: <Map className="w-5 h-5" />,
          label: 'Vista Mappa',
          action: () => onChangeView?.('map'),
          active: currentView === 'map'
        },
        {
          icon: <MapPin className="w-5 h-5" />,
          label: 'Attività Vicine',
          action: () => console.log('Show nearby businesses')
        },
        {
          icon: <Star className="w-5 h-5" />,
          label: 'Preferiti',
          action: () => console.log('Show favorites')
        }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: 'Profilo Utente',
          action: () => onShowSettings?.()
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: 'Impostazioni',
          action: () => onShowSettings?.()
        },
        {
          icon: <Bell className="w-5 h-5" />,
          label: 'Notifiche',
          action: () => console.log('Show notifications')
        },
        {
          icon: <Lock className="w-5 h-5" />,
          label: 'Privacy e Sicurezza',
          action: () => console.log('Show privacy settings')
        }
      ]
    }
  ];

  // Add business section for business owners
  if (user?.user_type === 'business_owner') {
    menuSections.push({
      id: 'business',
      title: 'La Mia Attività',
      items: [
        {
          icon: <Store className="w-5 h-5" />,
          label: 'Dashboard Attività',
          action: () => onShowBusinessDashboard?.()
        },
        {
          icon: <Edit3 className="w-5 h-5" />,
          label: 'Modifica Profilo',
          action: () => console.log('Edit business profile')
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          label: 'Recensioni',
          action: () => console.log('Manage reviews')
        },
        {
          icon: <Palette className="w-5 h-5" />,
          label: 'Personalizza Vetrina',
          action: () => console.log('Customize storefront')
        }
      ]
    });
  }

  // Add admin section for admins
  if (user?.user_type === 'admin') {
    menuSections.push({
      id: 'admin',
      title: 'Amministrazione',
      items: [
        {
          icon: <Shield className="w-5 h-5" />,
          label: 'Pannello Admin',
          action: () => onShowAdminPanel?.()
        },
        {
          icon: <User className="w-5 h-5" />,
          label: 'Gestione Utenti',
          action: () => onShowAdminPanel?.()
        },
        {
          icon: <Store className="w-5 h-5" />,
          label: 'Moderazione Attività',
          action: () => onShowAdminPanel?.()
        }
      ]
    });
  }

  // Add manager section for managers
  if (user?.user_type === 'manager') {
    menuSections.push({
      id: 'manager',
      title: 'Manager',
      items: [
        {
          icon: <Crown className="w-5 h-5" />,
          label: 'Pannello Manager',
          action: () => onShowManagerPanel?.()
        },
        {
          icon: <User className="w-5 h-5" />,
          label: 'Gestione Completa',
          action: () => onShowManagerPanel?.()
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: 'Configurazioni Sistema',
          action: () => onShowManagerPanel?.()
        }
      ]
    });
  }

  // Add support section
  menuSections.push({
    id: 'support',
    title: 'Supporto',
    items: [
      {
        icon: <Phone className="w-5 h-5" />,
        label: 'Contatti',
        action: () => onShowContacts?.()
      },
      {
        icon: <HelpCircle className="w-5 h-5" />,
        label: 'Centro Assistenza',
        action: () => console.log('Show help center')
      },
      {
        icon: <FileText className="w-5 h-5" />,
        label: 'Termini e Privacy',
        action: () => console.log('Show terms and privacy')
      },
      {
        icon: <Mail className="w-5 h-5" />,
        label: 'Feedback',
        action: () => console.log('Send feedback')
      }
    ]
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-full sm:w-80 max-w-sm`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name} 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-base">{user.name || 'Utente'}</p>
                <p className="text-orange-100 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    user.user_type === 'business_owner' 
                      ? 'bg-orange-200 text-orange-800'
                      : user.user_type === 'admin'
                      ? 'bg-red-200 text-red-800'
                      : user.user_type === 'manager'
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {user.user_type === 'business_owner' ? 'Titolare' : 
                     user.user_type === 'admin' ? 'Admin' : 
                     user.user_type === 'manager' ? 'Manager' : 'Cliente'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Sections */}
        <div className="p-3 sm:p-4">
          {menuSections.map((section) => (
            <div key={section.id} className="mb-4 sm:mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuClick(item.action)}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all hover:bg-gray-50 text-sm sm:text-base ${
                      item.active ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'text-gray-700'
                    }`}
                  >
                    <span className={item.active ? 'text-orange-600' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Azioni Rapide
            </h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-3 text-center transition-colors">
                <Globe className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-orange-700 block">Esplora</span>
              </button>
              
              <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-center transition-colors">
                <Heart className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-blue-700 block">Preferiti</span>
              </button>
              
              <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-center transition-colors">
                <Smartphone className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-green-700 block">App Mobile</span>
              </button>
              
              <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-center transition-colors">
                <Star className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-purple-700 block">Recensioni</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-5 h-5" />
              <span>Esci</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">La Rete del Borgo</p>
            <p className="text-xs text-gray-400">Versione 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
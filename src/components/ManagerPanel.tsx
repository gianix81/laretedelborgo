import React, { useState, useEffect, useCallback } from 'react';
import { 
  Crown, Users, Building2, MessageSquare, Settings, BarChart3, Shield, X, Search,
  Filter, CheckCircle, XCircle, Eye, EyeOff, Clock, AlertTriangle, Trash2, Edit3, MoreVertical,
  TrendingUp, Calendar, Star, MapPin, Phone
} from 'lucide-react';
import { User, Business } from '../types';
import { supabase } from '../lib/supabase'; // Importiamo supabase per le chiamate e il realtime
import * as api from '../lib/storage'; // Importiamo le nostre nuove funzioni API
import ImageUploader from './ImageUploader'; // Assicurati che questo componente esista e sia nel percorso corretto

interface ManagerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const ManagerPanel: React.FC<ManagerPanelProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'businesses' | 'users' | 'settings'>('dashboard');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'>('all');
  
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Business>>({});

  const loadData = useCallback(async () => {
    console.log("🔄 Caricamento dati da Supabase...");
    const [allBusinesses, allUsers] = await Promise.all([
      api.getBusinesses(),
      api.getUsers()
    ]);
    setBusinesses(allBusinesses);
    setUsers(allUsers);
    console.log("✅ Dati caricati.", { businesses: allBusinesses.length, users: allUsers.length });
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();

      // SOLUZIONE DEFINITIVA ALLA SINCRONIZZAZIONE
      const channel = supabase
        .channel('manager_panel_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'global_businesses' },
          (payload) => {
            console.log('Realtime: ricevuto cambiamento nelle attività! Ricarico...', payload);
            loadData();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'global_users' },
          (payload) => {
            console.log('Realtime: ricevuto cambiamento negli utenti! Ricarico...', payload);
            loadData();
          }
        )
        .subscribe();

      // Pulisce la sottoscrizione quando il pannello si chiude
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, loadData]);

  if (!isOpen || currentUser.role !== 'MANAGER') return null;

  const handleApproveBusiness = async (businessId: string) => {
    await api.updateBusiness(businessId, {
      approved: true,
      active: true,
      approval_status: 'approved',
    });
    alert('✅ Attività approvata e resa visibile!');
    // I dati si ricaricano da soli grazie al Realtime, ma una chiamata manuale aggiorna subito la UI
    await loadData();
  };

  const handleRejectBusiness = async (businessId: string) => {
    const reason = prompt('Motivo del rifiuto:');
    if (reason) {
      await api.updateBusiness(businessId, {
        approved: false,
        active: false,
        approval_status: 'rejected',
        rejection_reason: reason,
      });
      alert('❌ Attività rifiutata.');
      await loadData();
    }
  };
  
  const handleToggleActive = async (businessId: string, currentActive: boolean) => {
    await api.updateBusiness(businessId, { active: !currentActive });
    alert(`✅ Attività ${!currentActive ? 'RESA VISIBILE' : 'NASCOSTA'}!`);
    await loadData();
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setEditForm(business);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBusiness) return;
    await api.updateBusiness(editingBusiness.id, editForm);
    setShowEditModal(false);
    setEditingBusiness(null);
    alert('Attività aggiornata con successo!');
    await loadData();
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa attività? Questa azione non può essere annullata.')) {
      await api.deleteBusiness(businessId);
      alert('Attività eliminata con successo.');
      await loadData();
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const name = business.name || '';
    const description = business.description || '';
    const matchesSearch = !searchTerm ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'pending' && (business.approval_status === 'pending' || !business.approval_status)) ||
      (filterStatus === 'approved' && business.approved) ||
      (filterStatus === 'rejected' && business.approval_status === 'rejected') ||
      (filterStatus === 'active' && business.active) ||
      (filterStatus === 'inactive' && !business.active);
      
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total_businesses: businesses.length,
    pending_businesses: businesses.filter(b => b.approval_status === 'pending' || !b.approval_status).length,
    active_businesses: businesses.filter(b => b.active).length,
    total_users: users.length,
    business_owners: users.filter(u => u.role === 'BUSINESS').length
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'businesses', label: 'Attività', icon: <Building2 className="w-4 h-4" /> },
    { id: 'users', label: 'Utenti', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Impostazioni', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-6xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">Pannello Manager</h2>
                <p className="text-purple-100 text-sm sm:text-base">Gestione completa piattaforma</p>
              </div>
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
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.id === 'businesses' && stats.pending_businesses > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {stats.pending_businesses}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* ... (Il tuo JSX per il Dashboard è qui e va bene così) ... */}
              </div>
            )}

            {/* Businesses Management */}
            {activeTab === 'businesses' && (
                <div className="space-y-6">
                    {/* ... (Il tuo JSX per la gestione delle attività è qui) ... */}
                    {/* Questa sezione usa `filteredBusinesses`, che ora prende i dati da Supabase */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                {/* ... (la tua thead) ... */}
                                <tbody className="divide-y divide-gray-200">
                                {filteredBusinesses.map((business) => {
                                    const owner = users.find(u => u.id === business.owner_id);
                                    return (
                                    <tr key={business.id} className="hover:bg-gray-50">
                                        {/* ... (la tua riga <tr> con i dati) ... */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleApproveBusiness(business.id)} className="text-green-600 hover:text-green-800 p-1" title="Approva"><CheckCircle className="w-4 h-4" /></button>
                                                <button onClick={() => handleRejectBusiness(business.id)} className="text-red-600 hover:text-red-800 p-1" title="Rifiuta"><XCircle className="w-4 h-4" /></button>
                                                <button onClick={() => handleEditBusiness(business)} className="text-blue-600 hover:text-blue-800 p-1" title="Modifica"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteBusiness(business.id)} className="text-red-600 hover:text-red-800 p-1" title="Elimina"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ... (le altre schede come Users e Settings) ... */}
          </div>
        </div>
      </div>

      {/* Edit Business Modal */}
      {showEditModal && editingBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* ... (il tuo JSX per la modale di modifica) ... */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                    <button
                        onClick={() => setShowEditModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSaveEdit}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                    >
                        Salva Modifiche
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPanel;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Crown, 
  Users, 
  Building2, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield, 
  X,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  Trash2,
  Edit3,
  MoreVertical,
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  Phone
} from 'lucide-react';
import { User, Business } from '../types';
import { storageManager } from '../lib/storage';
import ImageUploader from './ImageUploader';

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
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    whatsapp: '',
    address: '',
    image: ''
  });

  const loadData = useCallback(() => {
    const allBusinesses = storageManager.getBusinesses();
    const allUsers = storageManager.getUsers();
    setBusinesses(allBusinesses);
    setUsers(allUsers);
    
    // Load pending requests
    const pending = JSON.parse(localStorage.getItem('borgo_pending_requests') || '[]');
    setPendingRequests(pending.filter((r: any) => r.status === 'pending'));
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);
  if (!isOpen || currentUser.user_type !== 'manager') return null;

  const handleApproveBusiness = (businessId: string) => {
    storageManager.updateBusiness(businessId, { 
      approved: true, 
      approval_status: 'approved',
      rejection_reason: undefined
    });
    loadData();
    alert('Attività approvata con successo!');
  };

  const handleRejectBusiness = (businessId: string) => {
    const reason = prompt('Motivo del rifiuto:');
    if (reason) {
      storageManager.updateBusiness(businessId, { 
        approved: false, 
        active: false,
        approval_status: 'rejected',
        rejection_reason: reason
      });
      loadData();
      alert('Attività rifiutata.');
    }
  };

  const handleToggleActive = (businessId: string, currentActive: boolean) => {
    storageManager.updateBusiness(businessId, { active: !currentActive });
    loadData();
    alert(`Attività ${!currentActive ? 'attivata' : 'disattivata'} con successo!`);
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setEditForm({
      name: business.name,
      description: business.description,
      category: business.category,
      phone: business.phone || '',
      whatsapp: business.whatsapp || '',
      address: business.address,
      image: business.image
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingBusiness) return;
    
    storageManager.updateBusiness(editingBusiness.id, {
      name: editForm.name,
      description: editForm.description,
      category: editForm.category,
      phone: editForm.phone,
      whatsapp: editForm.whatsapp,
      address: editForm.address,
      image: editForm.image
    });
    
    loadData();
    setShowEditModal(false);
    setEditingBusiness(null);
    alert('Attività aggiornata con successo!');
  };
  const handleDeleteBusiness = (businessId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa attività? Questa azione non può essere annullata.')) {
      storageManager.deleteBusiness(businessId);
      loadData();
      alert('Attività eliminata con successo.');
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = !searchTerm || 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'pending' && business.approval_status === 'pending') ||
      (filterStatus === 'approved' && business.approved) ||
      (filterStatus === 'rejected' && business.approval_status === 'rejected') ||
      (filterStatus === 'active' && business.active) ||
      (filterStatus === 'inactive' && !business.active);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total_businesses: businesses.length,
    pending_businesses: businesses.filter(b => b.approval_status === 'pending').length,
    approved_businesses: businesses.filter(b => b.approved).length,
    active_businesses: businesses.filter(b => b.active).length,
    total_users: users.length,
    business_owners: users.filter(u => u.user_type === 'business_owner').length
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'businesses', label: 'Attività', icon: <Building2 className="w-4 h-4" /> },
    { id: 'requests', label: 'Richieste', icon: <Clock className="w-4 h-4" /> },
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
                  {tab.id === 'requests' && pendingRequests.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingRequests.length}
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Panoramica Manager</h3>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-purple-900">Privilegi Manager</h4>
                      <p className="text-sm text-purple-700">
                        Come Manager puoi registrare e gestire un numero illimitato di attività per la piattaforma.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Attività Totali</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_businesses}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">In Attesa</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.pending_businesses}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Attive</p>
                        <p className="text-3xl font-bold text-green-600">{stats.active_businesses}</p>
                      </div>
                      <Eye className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Utenti Totali</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.total_users}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Business Owner</p>
                        <p className="text-3xl font-bold text-indigo-600">{stats.business_owners}</p>
                      </div>
                      <Shield className="w-8 h-8 text-indigo-500" />
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {stats.pending_businesses > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div>
                        <h4 className="font-medium text-orange-900">
                          {stats.pending_businesses} attività in attesa di approvazione
                        </h4>
                        <p className="text-sm text-orange-700">
                          Controlla le nuove registrazioni e approva quelle idonee
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('businesses')}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                      >
                        Gestisci
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Businesses Management */}
            {activeTab === 'businesses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Gestione Attività</h3>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cerca attività..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                    >
                      <option value="all">Tutte</option>
                      <option value="pending">In Attesa</option>
                      <option value="approved">Approvate</option>
                      <option value="rejected">Rifiutate</option>
                      <option value="active">Attive</option>
                      <option value="inactive">Inattive</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Attività</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Proprietario</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Stato</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Visibilità</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Data</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-900 text-sm">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredBusinesses.map((business) => {
                          const owner = users.find(u => u.id === business.owner_id);
                          return (
                            <tr key={business.id} className="hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={business.image} 
                                    alt={business.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">{business.name}</p>
                                    <p className="text-sm text-gray-600">{business.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">{owner?.name || 'N/A'}</p>
                                  <p className="text-sm text-gray-600">{owner?.email || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  business.approval_status === 'approved' 
                                    ? 'bg-green-100 text-green-700'
                                    : business.approval_status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {business.approval_status === 'approved' ? 'Approvata' :
                                   business.approval_status === 'rejected' ? 'Rifiutata' : 'In Attesa'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    business.active === true
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {business.active === true ? 'Attiva' : 'Inattiva'}
                                  </span>
                                  <button
                                    onClick={() => handleToggleActive(business.id, business.active === true)}
                                    className={`p-1 rounded transition-colors ${
                                      business.active === true
                                        ? 'text-green-600 hover:text-green-800'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    title={business.active === true ? 'Disattiva' : 'Attiva'}
                                  >
                                    {business.active === true ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {new Date(business.created_at || '').toLocaleDateString('it-IT')}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  {(business.approval_status === 'pending' || business.approval_status === undefined) && (
                                    <>
                                      <button
                                        onClick={() => handleApproveBusiness(business.id)}
                                        className="text-green-600 hover:text-green-800 p-1 transition-colors"
                                        title="Approva"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleRejectBusiness(business.id)}
                                        className="text-red-600 hover:text-red-800 p-1 transition-colors"
                                        title="Rifiuta"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleEditBusiness(business)}
                                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                    title="Modifica"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBusiness(business.id)}
                                    className="text-red-600 hover:text-red-800 p-1 transition-colors"
                                    title="Elimina"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
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

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Richieste di Modifica</h3>
                
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna richiesta in attesa</h3>
                    <p className="text-gray-600">Tutte le richieste di modifica sono state elaborate</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => {
                      const business = businesses.find(b => b.id === request.businessId);
                      const user = users.find(u => u.id === request.userId);
                      
                      return (
                        <div key={request.id || `${request.businessId}-${request.requestedAt}`} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Modifica Attività: {business?.name || 'Attività non trovata'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Richiesta da: {user?.name || user?.email || 'Utente sconosciuto'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(request.requestedAt).toLocaleString('it-IT')}
                              </p>
                            </div>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                              In Attesa
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-gray-900 mb-3">Modifiche Richieste:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {request.changes.name !== business?.name && (
                                <div>
                                  <span className="font-medium text-gray-700">Nome:</span>
                                  <div className="text-red-600">- {business?.name}</div>
                                  <div className="text-green-600">+ {request.changes.name}</div>
                                </div>
                              )}
                              {request.changes.description !== business?.description && (
                                <div>
                                  <span className="font-medium text-gray-700">Descrizione:</span>
                                  <div className="text-red-600 truncate">- {business?.description}</div>
                                  <div className="text-green-600 truncate">+ {request.changes.description}</div>
                                </div>
                              )}
                              {request.changes.phone !== business?.phone && (
                                <div>
                                  <span className="font-medium text-gray-700">Telefono:</span>
                                  <div className="text-red-600">- {business?.phone}</div>
                                  <div className="text-green-600">+ {request.changes.phone}</div>
                                </div>
                              )}
                              {request.changes.address !== business?.address && (
                                <div>
                                  <span className="font-medium text-gray-700">Indirizzo:</span>
                                  <div className="text-red-600 truncate">- {business?.address}</div>
                                  <div className="text-green-600 truncate">+ {request.changes.address}</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleRejectPendingRequest(request.id || `${request.businessId}-${request.requestedAt}`)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Rifiuta
                            </button>
                            <button
                              onClick={() => handleApprovePendingRequest(request.id || `${request.businessId}-${request.requestedAt}`)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approva
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Richieste di Modifica</h3>
                
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna richiesta in attesa</h3>
                    <p className="text-gray-600">Tutte le richieste di modifica sono state elaborate</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.businessName}</h4>
                            <p className="text-sm text-gray-600">Richiesta di: {request.ownerName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                            In Attesa
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {Object.entries(request.changes).map(([field, change]: [string, any]) => (
                            <div key={field} className="bg-gray-50 rounded-lg p-3">
                              <h5 className="font-medium text-gray-900 mb-2 capitalize">
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-xs text-red-600 font-medium">Vecchio:</span>
                                  <p className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                                    {change.old || 'Non specificato'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-green-600 font-medium">Nuovo:</span>
                                  <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                                    {change.new || 'Non specificato'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              const reason = prompt('Motivo del rifiuto:');
                              if (reason) {
                                // Handle reject
                                const updatedRequests = pendingRequests.filter(r => r.id !== request.id);
                                setPendingRequests(updatedRequests);
                                localStorage.setItem('borgo_pending_requests', JSON.stringify([
                                  ...JSON.parse(localStorage.getItem('borgo_pending_requests') || '[]').filter((r: any) => r.id !== request.id),
                                  { ...request, status: 'rejected', rejectionReason: reason }
                                ]));
                                alert('Richiesta rifiutata');
                              }
                            }}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                          >
                            Rifiuta
                          </button>
                          <button
                            onClick={() => {
                              // Apply changes to business
                              storageManager.updateBusiness(request.businessId, request.changes);
                              
                              // Remove from pending
                              const updatedRequests = pendingRequests.filter(r => r.id !== request.id);
                              setPendingRequests(updatedRequests);
                              localStorage.setItem('borgo_pending_requests', JSON.stringify([
                                ...JSON.parse(localStorage.getItem('borgo_pending_requests') || '[]').filter((r: any) => r.id !== request.id),
                                { ...request, status: 'approved' }
                              ]));
                              
                              loadData();
                              alert('Richiesta approvata e modifiche applicate!');
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Approva
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Gestione Utenti</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Utente</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Tipo</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Registrato</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Stato</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                  ) : (
                                    <span className="text-gray-600 font-medium text-sm">
                                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{user.name || 'Nome non disponibile'}</p>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.user_type === 'business_owner' 
                                  ? 'bg-orange-100 text-orange-700'
                                  : user.user_type === 'admin'
                                  ? 'bg-red-100 text-red-700'
                                  : user.user_type === 'manager'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user.user_type === 'business_owner' ? 'Titolare' : 
                                 user.user_type === 'admin' ? 'Admin' : 
                                 user.user_type === 'manager' ? 'Manager' : 'Cliente'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(user.created_at).toLocaleDateString('it-IT')}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {user.is_banned ? 'Bannato' : 'Attivo'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Impostazioni Sistema</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Configurazioni Generali</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Approvazione Automatica</div>
                        <div className="text-sm text-gray-600">Le nuove attività vengono approvate automaticamente</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Notifiche Email</div>
                        <div className="text-sm text-gray-600">Invia notifiche email per nuove registrazioni</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-900 mb-4">Zona Pericolosa</h4>
                  <div className="space-y-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Reset Database
                    </button>
                    <p className="text-sm text-red-700">
                      Attenzione: questa azione eliminerà tutti i dati e non può essere annullata.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Business Modal */}
      {showEditModal && editingBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Modifica Attività: {editingBusiness.name}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBusiness(null);
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
                      Nome Attività
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    >
                      <option value="restaurant">Ristorazione</option>
                      <option value="shopping">Shopping</option>
                      <option value="services">Servizi</option>
                      <option value="wellness">Benessere</option>
                      <option value="professional">Professionisti</option>
                      <option value="culture">Cultura</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indirizzo
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={editForm.whatsapp}
                      onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Immagine Attività
                  </label>
                  <ImageUploader
                    currentImage={editForm.image}
                    onImageChange={(dataUrl) => setEditForm(prev => ({ ...prev, image: dataUrl || prev.image }))}
                    placeholder="Carica nuova immagine"
                    maxWidth={800}
                    maxHeight={600}
                    quality={0.8}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBusiness(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Salva Modifiche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPanel;
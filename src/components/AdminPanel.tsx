import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Building2, 
  MessageSquare, 
  AlertTriangle, 
  Ban, 
  Trash2, 
  Eye, 
  X,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { User, Business, Comment, AdminStats } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'businesses' | 'comments'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'flagged'>('all');

  // Mock data - in produzione questi dati verranno da Supabase
  const [stats] = useState<AdminStats>({
    total_businesses: 47,
    total_users: 1234,
    total_comments: 567,
    flagged_comments: 8,
    banned_users: 3,
    pending_businesses: 12
  });

  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'mario.rossi@email.com',
      name: 'Mario Rossi',
      created_at: '2024-01-15T10:30:00Z',
      user_type: 'customer'
    },
    {
      id: '2',
      email: 'elena.bianchi@boutique.com',
      name: 'Elena Bianchi',
      created_at: '2024-02-20T14:15:00Z',
      user_type: 'business_owner'
    },
    {
      id: '3',
      email: 'spam.user@fake.com',
      name: 'Spam User',
      created_at: '2024-03-01T09:00:00Z',
      user_type: 'customer',
      is_banned: true,
      banned_reason: 'Spam e contenuti inappropriati',
      banned_at: '2024-03-05T16:20:00Z'
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      business_id: '1',
      user_id: '1',
      user_name: 'Mario Rossi',
      content: 'Ottimo ristorante, cibo eccellente e servizio impeccabile!',
      rating: 5,
      created_at: '2024-03-10T19:30:00Z'
    },
    {
      id: '2',
      business_id: '2',
      user_id: '3',
      user_name: 'Spam User',
      content: 'Contenuto inappropriato e offensivo che viola i termini di servizio...',
      rating: 1,
      created_at: '2024-03-12T11:15:00Z',
      is_flagged: true,
      flag_reason: 'Linguaggio offensivo'
    }
  ]);

  const [pendingBusinesses] = useState<Business[]>([
    {
      id: 'pending-1',
      name: 'Nuovo Ristorante',
      category: 'restaurant',
      description: 'Ristorante in attesa di approvazione',
      image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 0,
      reviewCount: 0,
      phone: '+39 0123 456789',
      whatsapp: '+39 333 1234567',
      address: 'Via Roma 15, 20121 Milano',
      hours: '12:00-14:30, 19:00-23:00',
      featured: false,
      coordinates: { lat: 45.4654, lng: 9.1859 },
      businessType: 'shop',
      appointmentBooking: false
    }
  ]);

  if (!isOpen || currentUser.user_type !== 'admin') return null;

  const handleBanUser = (userId: string, reason: string) => {
    console.log(`Banning user ${userId} for: ${reason}`);
    // Implementazione ban utente
    alert(`Utente bannato per: ${reason}`);
  };

  const handleDeleteComment = (commentId: string) => {
    console.log(`Deleting comment ${commentId}`);
    // Implementazione eliminazione commento
    alert('Commento eliminato');
  };

  const handleDeleteBusiness = (businessId: string) => {
    console.log(`Deleting business ${businessId}`);
    // Implementazione eliminazione attività
    alert('Attività eliminata');
  };

  const handleApproveBusiness = (businessId: string) => {
    console.log(`Approving business ${businessId}`);
    // Implementazione approvazione attività
    alert('Attività approvata');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'banned' && user.is_banned) ||
      (filterStatus === 'active' && !user.is_banned);
    
    return matchesSearch && matchesFilter;
  });

  const filteredComments = comments.filter(comment => {
    const matchesSearch = !searchTerm || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'flagged' && comment.is_flagged);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-6xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">Pannello Amministrazione</h2>
                <p className="text-red-100 text-sm sm:text-base hidden sm:block">Gestione e moderazione piattaforma</p>
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
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-shrink-0 sm:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'dashboard'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="whitespace-nowrap">Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-shrink-0 sm:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'users'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="whitespace-nowrap">Utenti</span>
                {stats.banned_users > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.banned_users}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('businesses')}
                className={`flex-shrink-0 sm:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'businesses'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="whitespace-nowrap">Attività</span>
                {stats.pending_businesses > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pending_businesses}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-shrink-0 sm:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'comments'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="whitespace-nowrap">Commenti</span>
                {stats.flagged_comments > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.flagged_comments}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-0">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Panoramica Piattaforma</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Utenti Totali</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_users}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Attività Attive</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_businesses}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commenti</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_comments}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="space-y-3 sm:space-y-4">
                  {stats.flagged_comments > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-red-900">
                            {stats.flagged_comments} commenti segnalati richiedono attenzione
                          </h4>
                          <p className="text-sm text-red-700">
                            Controlla i commenti segnalati per contenuti inappropriati
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('comments')}
                          className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
                        >
                          Gestisci
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {stats.pending_businesses > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-orange-900">
                            {stats.pending_businesses} attività in attesa di approvazione
                          </h4>
                          <p className="text-sm text-orange-700">
                            Nuove registrazioni da verificare e approvare
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('businesses')}
                          className="bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-700 transition-colors whitespace-nowrap"
                        >
                          Approva
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div className="sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Gestione Utenti</h3>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cerca utenti..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                    >
                      <option value="all">Tutti</option>
                      <option value="active">Attivi</option>
                      <option value="banned">Bannati</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">Utente</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">Tipo</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm hidden sm:table-cell">Registrato</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">Stato</th>
                          <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
                                  ) : (
                                    <span className="text-gray-600 font-medium text-xs sm:text-sm">
                                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{user.name || 'Nome non disponibile'}</p>
                                  <p className="text-xs text-gray-600 truncate max-w-[120px] sm:max-w-none">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.user_type === 'business_owner' 
                                  ? 'bg-orange-100 text-orange-700'
                                  : user.user_type === 'admin'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user.user_type === 'business_owner' ? 'Titolare' : 
                                 user.user_type === 'admin' ? 'Admin' : 'Cliente'}
                              </span>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                              {new Date(user.created_at).toLocaleDateString('it-IT')}
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              {user.is_banned ? (
                                <div>
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    Bannato
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">{user.banned_reason}</p>
                                </div>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Attivo
                                </span>
                              )}
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <div className="flex items-center justify-end gap-2">
                                {!user.is_banned && user.user_type !== 'admin' && (
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Motivo del ban:');
                                      if (reason) handleBanUser(user.id, reason);
                                    }}
                                    className="text-red-600 hover:text-red-800 p-1 transition-colors"
                                    title="Banna utente"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  className="text-gray-600 hover:text-gray-800 p-1 transition-colors"
                                  title="Visualizza dettagli"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Businesses Management */}
            {activeTab === 'businesses' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Gestione Attività</h3>
                </div>

                {/* Pending Approvals */}
                {pendingBusinesses.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Attività in Attesa di Approvazione ({pendingBusinesses.length})
                    </h4>
                    
                    <div className="space-y-4">
                      {pendingBusinesses.map((business) => (
                        <div key={business.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <img 
                              src={business.image} 
                              alt={business.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">{business.name}</h5>
                              <p className="text-sm text-gray-600 mb-2">{business.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>📍 {business.address}</span>
                                <span>📞 {business.phone}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveBusiness(business.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approva
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Motivo del rifiuto:');
                                  if (reason) handleDeleteBusiness(business.id);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Rifiuta
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Businesses */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Attività Attive</h4>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-gray-600">Lista delle attività attive con possibilità di moderazione...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Management */}
            {activeTab === 'comments' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Gestione Commenti</h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cerca commenti..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    >
                      <option value="all">Tutti</option>
                      <option value="flagged">Segnalati</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredComments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`bg-white rounded-lg border p-4 ${
                        comment.is_flagged ? 'border-red-200 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {comment.user_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{comment.user_name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`text-sm ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString('it-IT')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-2">{comment.content}</p>
                          
                          {comment.is_flagged && (
                            <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-900">
                                  Segnalato: {comment.flag_reason}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              if (confirm('Sei sicuro di voler eliminare questo commento?')) {
                                handleDeleteComment(comment.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-2 transition-colors"
                            title="Elimina commento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          {comment.is_flagged && (
                            <button
                              onClick={() => {
                                const reason = prompt('Motivo del ban per questo utente:');
                                if (reason) handleBanUser(comment.user_id, reason);
                              }}
                              className="text-red-600 hover:text-red-800 p-2 transition-colors"
                              title="Banna utente"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
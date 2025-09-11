import React, { useState, useEffect, useCallback } from 'react';
import { 
  // ...tutte le tue icone da lucide-react...
  Crown, Users, Building2, MessageSquare, Settings, BarChart3, Shield, X, Search,
  Filter, CheckCircle, XCircle, Eye, EyeOff, Clock, AlertTriangle, Trash2, Edit3
} from 'lucide-react';
import { User, Business } from '../types';
// IMPORTANTE: Importiamo le nuove funzioni API da storage.ts (che ora parla con Supabase)
import * as api from '../lib/storage';
import { supabase } from '../lib/supabase'; // Importiamo anche supabase per il realtime

// L'interfaccia rimane la stessa
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
  // STATO PER LA MODALE DI MODIFICA
  const [editForm, setEditForm] = useState<Partial<Business>>({});
  const [showEditModal, setShowEditModal] = useState(false);

  // NUOVA FUNZIONE loadData ASINCRONA
  const loadData = useCallback(async () => {
    console.log("🔄 Caricamento dati da Supabase...");
    const allBusinesses = await api.getBusinesses();
    const allUsers = await api.getUsers();
    setBusinesses(allBusinesses);
    setUsers(allUsers);
    console.log("✅ Dati caricati.", { businesses: allBusinesses.length, users: allUsers.length });
  }, []);

  // useEffect per caricare i dati e per il REALTIME
  useEffect(() => {
    if (isOpen) {
      loadData();

      // QUESTA È LA SOLUZIONE ALLA SINCRONIZZAZIONE!
      const channel = supabase
        .channel('manager_panel_updates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'global_businesses' },
          (payload) => {
            console.log('Realtime: ricevuto cambiamento nelle attività! Ricarico...', payload);
            loadData(); // Ricarica i dati quando il database cambia
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'global_users' },
          (payload) => {
            console.log('Realtime: ricevuto cambiamento negli utenti! Ricarico...', payload);
            loadData(); // Ricarica anche quando cambiano gli utenti
          }
        )
        .subscribe();

      // Pulisce la sottoscrizione quando il pannello si chiude
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, loadData]);

  if (!isOpen || currentUser.role !== 'MANAGER') return null; // Uso 'role' come da nostro schema DB

  // ========= NUOVE FUNZIONI DI GESTIONE (TUTTE ASYNC) =========
  
  const handleApproveBusiness = async (businessId: string) => {
    try {
      await api.updateBusiness(businessId, {
        approved: true,
        active: true,
        approval_status: 'approved',
      });
      alert('✅ Attività approvata e resa visibile!');
      // I dati si ricaricheranno automaticamente grazie al realtime,
      // ma una chiamata manuale può rendere l'UI più reattiva
      loadData();
    } catch (error) {
      console.error('❌ Errore durante l\'approvazione:', error);
      alert('Errore durante l\'approvazione');
    }
  };

  const handleRejectBusiness = async (businessId: string) => {
    const reason = prompt('Motivo del rifiuto:');
    if (reason) {
      try {
        await api.updateBusiness(businessId, {
          approved: false,
          active: false,
          approval_status: 'rejected',
          rejection_reason: reason,
        });
        alert('❌ Attività rifiutata.');
        loadData();
      } catch (error) {
        console.error('❌ Errore durante il rifiuto:', error);
        alert('Errore durante il rifiuto');
      }
    }
  };
  
  const handleToggleActive = async (businessId: string, currentActive: boolean) => {
      try {
        await api.updateBusiness(businessId, { active: !currentActive });
        alert(`✅ Attività ${!currentActive ? 'RESA VISIBILE' : 'NASCOSTA'}!`);
        loadData();
      } catch(error){
        console.error('❌ Errore durante il toggle:', error);
        alert('Errore durante la modifica della visibilità');
      }
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setEditForm(business);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBusiness) return;
    try {
        await api.updateBusiness(editingBusiness.id, editForm);
        setShowEditModal(false);
        setEditingBusiness(null);
        alert('Attività aggiornata con successo!');
        loadData();
    } catch(error){
        console.error('❌ Errore nel salvataggio:', error);
        alert('Errore durante il salvataggio delle modifiche');
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa attività? L\'azione è irreversibile.')) {
        try {
            await api.deleteBusiness(businessId);
            alert('Attività eliminata con successo.');
            loadData();
        } catch(error){
            console.error('❌ Errore nell\'eliminazione:', error);
            alert('Errore durante l\'eliminazione');
        }
    }
  };

  // La logica di filtraggio e le statistiche possono rimanere simili,
  // dato che operano sullo stato locale del componente (`businesses`, `users`)
  const filteredBusinesses = businesses.filter(business => {
    // ...logica di filtro (invariata)...
    return true; // Sostituisci con la tua logica di filtro
  });

  const stats = {
    total_businesses: businesses.length,
    pending_businesses: businesses.filter(b => b.approval_status === 'pending').length,
    active_businesses: businesses.filter(b => b.active).length,
    total_users: users.length,
    business_owners: users.filter(u => u.role === 'BUSINESS').length // Uso 'role'
  };
  
  // Il resto del componente (la parte JSX per l'interfaccia) può rimanere quasi identico
  // perché legge i dati dallo stato del componente (es. `businesses`, `users`, `stats`).
  // Ho rimosso la parte JSX per brevità, ma tu devi mantenerla.
  return (
    // ... IL TUO CODICE JSX VA QUI ...
    // ... NON CANCELLARE LA PARTE GRAFICA DEL TUO COMPONENTE! ...
  );
};

export default ManagerPanel;
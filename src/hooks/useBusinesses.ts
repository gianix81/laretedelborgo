import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Business } from '../types';
import { storageManager } from '../lib/storage';

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funzione per caricare le attività
  const loadBusinesses = async () => {
    console.log('🔄 Loading businesses...');
    setLoading(true);
    setError(null);
    
    try {
      if (isSupabaseConfigured()) {
        console.log('📡 Using Supabase for data');
        
        // Carica da Supabase
        const { data, error: supabaseError } = await supabase
          .from('global_businesses')
          .select('*')
          .eq('approved', true)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('❌ Supabase error:', supabaseError);
          throw supabaseError;
        }

        console.log('✅ Loaded from Supabase:', data?.length || 0, 'businesses');
        setBusinesses(data || []);
        
      } else {
        console.log('💾 Using local storage for data');
        
        // Fallback al storage locale
        storageManager.initialize();
        const allBusinesses = storageManager.getBusinesses();
        
        const visibleBusinesses = allBusinesses.filter(business => {
          const isApproved = business.approved === true || business.approval_status === 'approved';
          const isActive = business.active !== false;
          return isApproved && isActive;
        });
        
        console.log('✅ Loaded from local storage:', visibleBusinesses.length, 'businesses');
        setBusinesses(visibleBusinesses);
      }
      
    } catch (err) {
      console.error('❌ Error loading businesses:', err);
      setError('Errore nel caricamento delle attività');
      
      // Fallback al storage locale in caso di errore
      try {
        storageManager.initialize();
        const allBusinesses = storageManager.getBusinesses();
        const visibleBusinesses = allBusinesses.filter(business => {
          const isApproved = business.approved === true || business.approval_status === 'approved';
          const isActive = business.active !== false;
          return isApproved && isActive;
        });
        setBusinesses(visibleBusinesses);
        console.log('🔄 Fallback to local storage successful');
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();

    // ======== REALTIME SYNCHRONIZATION ========
    if (isSupabaseConfigured()) {
      console.log('🔴 Setting up realtime subscription for businesses');
      
      const subscription = supabase
        .channel('businesses_changes')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'global_businesses' 
          },
          (payload) => {
            console.log('🔴 Realtime change detected:', payload.eventType, payload);
            
            // Ricarica automaticamente le attività quando c'è un cambiamento
            loadBusinesses();
          }
        )
        .subscribe((status) => {
          console.log('🔴 Subscription status:', status);
        });

      // Cleanup subscription on unmount
      return () => {
        console.log('🔴 Cleaning up realtime subscription');
        subscription.unsubscribe();
      };
    }
  }, []);

  return {
    businesses,
    loading,
    error,
    refetch: loadBusinesses
  };
};
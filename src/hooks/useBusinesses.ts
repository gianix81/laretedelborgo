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
    console.log('🚀 LOADING BUSINESSES - START');
    setLoading(true);
    setError(null);
    
    try {
      // PRIMA: Prova sempre dal storage locale
      console.log('💾 Loading from LOCAL STORAGE first...');
      storageManager.initialize();
      const localBusinesses = storageManager.getBusinesses();
      console.log('📊 LOCAL STORAGE - Total businesses:', localBusinesses.length);
      console.log('📋 LOCAL STORAGE - Raw data:', localBusinesses);
      
      // FILTRO MANAGER: Solo attività approvate E attive sono visibili
      const visibleBusinesses = localBusinesses.filter(business => {
        const isApproved = business.approved === true || business.approval_status === 'approved';
        const isActive = business.active === true;
        console.log(`🔍 Business ${business.name}: approved=${isApproved}, active=${isActive}`);
        return isApproved && isActive;
      });
      
      console.log('✅ VISIBLE BUSINESSES AFTER MANAGER FILTER:', visibleBusinesses.length);
      setBusinesses(visibleBusinesses);
      setLoading(false);
      return;

      // SECONDO: Se storage locale è vuoto, prova Supabase
      if (isSupabaseConfigured()) {
        console.log('📡 LOCAL STORAGE EMPTY - Trying Supabase...');
        
        const { data, error: supabaseError } = await supabase
          .from('global_businesses')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('❌ Supabase error:', supabaseError);
          throw supabaseError;
        }

        console.log('📊 SUPABASE - Raw data:', data);
        console.log('✅ SHOWING ALL SUPABASE BUSINESSES:', data?.length || 0);
        setBusinesses(data || []);
      } else {
        console.log('⚠️ NO SUPABASE CONFIG - Using empty array');
        setBusinesses([]);
      }
      
    } catch (err) {
      console.error('❌ Error loading businesses:', err);
      setError('Errore nel caricamento delle attività');
      
      // Fallback finale
      try {
        const fallbackBusinesses = storageManager.getBusinesses();
        console.log('🔄 FALLBACK - Showing:', fallbackBusinesses.length, 'businesses');
        setBusinesses(fallbackBusinesses);
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError);
        setBusinesses([]);
      }
    } finally {
      setLoading(false);
      console.log('🏁 LOADING BUSINESSES - END');
    }
  };

  useEffect(() => {
    loadBusinesses();

    // Realtime subscription solo se Supabase è configurato
    if (isSupabaseConfigured()) {
      console.log('🔴 Setting up realtime subscription');
      
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
            loadBusinesses();
          }
        )
        .subscribe((status) => {
          console.log('🔴 Subscription status:', status);
        });

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
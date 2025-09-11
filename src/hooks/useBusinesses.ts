// src/hooks/useBusinesses.ts
import { useEffect, useState, useCallback } from 'react';
// Se hai un tipo Business definito, usa quello:
// import type { Business } from '../types';
import storageManager from '../lib/storage'; // default export: va bene rinominarlo "storageManager"

type Business = any; // rimpiazza con il tuo tipo reale se esiste

export function useBusinesses() {
  const [data, setData] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await storageManager.getBusinesses();
      setData(Array.isArray(list) ? list : []);
    } catch (e: any) {
      console.error('useBusinesses: errore nel caricamento', e);
      setError(e?.message ?? 'Errore durante il caricamento delle attività');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await storageManager.getBusinesses();
        if (alive) setData(Array.isArray(list) ? list : []);
      } catch (e: any) {
        if (alive) setError(e?.message ?? 'Errore durante il caricamento delle attività');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return {
    businesses: data,
    loading,
    error,
    refresh: fetchBusinesses,
  };
}

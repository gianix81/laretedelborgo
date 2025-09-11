import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Assicurati che il percorso sia giusto
import { User } from '@supabase/supabase-js';

// Puoi estendere questo tipo se hai un profilo utente più dettagliato
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // onAuthStateChange è il modo corretto per gestire le sessioni in tempo reale.
    // Si attiva al caricamento, al login, al logout, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        error: null
      });
    });

    // Pulisci il listener quando il componente viene smontato
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Email o password non corretti"
      }));
      return { success: false, error: error.message };
    }
    
    // Lo stato verrà aggiornato automaticamente dal listener onAuthStateChange
    return { success: true };
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    // user_type è un dato del profilo, non di auth. Lo passiamo come metadato.
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        // Questi dati vengono salvati in raw_user_meta_data in auth.users
        // e il nostro trigger li userà per creare il profilo in public.global_users
        data: {
          name: userData.name,
          // Puoi aggiungere altri campi qui, come il 'role' o 'user_type' iniziale
        }
      }
    });

    if (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return { success: false, error: error.message };
    }
    
    // Lo stato verrà aggiornato automaticamente dal listener onAuthStateChange
    // dopo che l'utente conferma l'email (se l'opzione è attiva)
    return { success: true, user: signUpData.user };
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    // Lo stato verrà aggiornato a null automaticamente dal listener
  };

  // Questa funzione ora aggiorna il profilo pubblico, non l'autenticazione
  const updateUserProfile = async (updates: any) => {
    if (!state.user) return { success: false, error: 'Utente non loggato' };

    const { error } = await supabase
      .from('global_users') // Aggiorniamo la tabella dei profili
      .update(updates)
      .eq('id', state.user.id);

    if (error) {
        console.error("Errore nell'aggiornamento del profilo:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };
};
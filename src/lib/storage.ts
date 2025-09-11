import { supabase } from '../lib/supabase'; // Assicurati che il percorso sia corretto!

// --- GESTIONE BUSINESSES ---

export async function getBusinesses() {
  const { data, error } = await supabase
    .from('global_businesses')
    .select('*');

  if (error) {
    console.error('Errore nel caricamento delle attività:', error);
    return [];
  }
  return data || [];
}

export async function addBusiness(businessData: any) {
  const { data, error } = await supabase
    .from('global_businesses')
    .insert([businessData])
    .select()
    .single();

  if (error) {
    console.error("Errore nell'aggiunta dell'attività:", error);
    return null;
  }
  return data;
}

export async function updateBusiness(businessId: string, updates: any) {
  const { data, error } = await supabase
    .from('global_businesses')
    .update(updates)
    .eq('id', businessId)
    .select()
    .single();
    
  if (error) {
    console.error("Errore nell'aggiornamento dell'attività:", error);
    return null;
  }
  return data;
}

export async function deleteBusiness(businessId: string) {
  const { error } = await supabase
    .from('global_businesses')
    .delete()
    .eq('id', businessId);

  if (error) {
    console.error("Errore nella cancellazione dell'attività:", error);
    return true; // Ritorna true se c'è stato un errore per gestirlo nella UI
  }
  return false; // Ritorna false se la cancellazione è andata a buon fine
}


// --- GESTIONE USERS ---

export async function getUsers() {
  const { data, error } = await supabase
    .from('global_users')
    .select('*');

  if (error) {
    console.error('Errore nel caricamento degli utenti:', error);
    return [];
  }
  return data || [];
}

// Nota: la funzione per aggiungere un utente è gestita dal Trigger che abbiamo creato.
// Questa funzione serve solo se vuoi creare un profilo utente manualmente per qualche motivo.
export async function addUser(userData: any) {
  const { data, error } = await supabase
    .from('global_users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("Errore nell'aggiunta dell'utente:", error);
    return null;
  }
  return data;
}

export async function updateUser(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('global_users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error("Errore nell'aggiornamento dell'utente:", error);
      return null;
    }
    return data;
}


// --- GESTIONE CATEGORIES ---

export async function getCategories() {
  const { data, error } = await supabase
    .from('global_categories')
    .select('*');

  if (error) {
    console.error('Errore nel caricamento delle categorie:', error);
    return [];
  }
  return data || [];
}

export async function addCategory(categoryData: any) {
    const { data, error } = await supabase
      .from('global_categories')
      .insert([categoryData])
      .select()
      .single();
  
    if (error) {
      console.error("Errore nell'aggiunta della categoria:", error);
      return null;
    }
    return data;
}

// ...e così via per updateCategory e deleteCategory, seguendo lo stesso pattern...


// --- GESTIONE COMMENTS ---

export async function getComments() {
    const { data, error } = await supabase
      .from('global_comments')
      .select('*');
  
    if (error) {
      console.error('Errore nel caricamento dei commenti:', error);
      return [];
    }
    return data || [];
}

export async function addComment(commentData: any) {
    const { data, error } = await supabase
      .from('global_comments')
      .insert([commentData])
      .select()
      .single();
  
    if (error) {
      console.error("Errore nell'aggiunta del commento:", error);
      return null;
    }
    return data;
}

// ...e così via per updateComment e deleteComment, seguendo lo stesso pattern...
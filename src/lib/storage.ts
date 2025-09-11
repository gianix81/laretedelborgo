// src/lib/storage.ts
import { supabase } from './supabase'; // verifica che questo path sia giusto

// ---------------------------------------------------------
// BUSINESSES
// ---------------------------------------------------------
export async function getBusinesses() {
  const { data, error } = await supabase.from('global_businesses').select('*');
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
    // true = errore, false = ok (mantengo la tua semantica)
    return true;
  }
  return false;
}

// ---------------------------------------------------------
// USERS
// ---------------------------------------------------------
export async function getUsers() {
  const { data, error } = await supabase.from('global_users').select('*');
  if (error) {
    console.error('Errore nel caricamento degli utenti:', error);
    return [];
  }
  return data || [];
}

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

// ---------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------
export async function getCategories() {
  const { data, error } = await supabase.from('global_categories').select('*');
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

export async function updateCategory(categoryId: string, updates: any) {
  const { data, error } = await supabase
    .from('global_categories')
    .update(updates)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) {
    console.error("Errore nell'aggiornamento della categoria:", error);
    return null;
  }
  return data;
}

export async function deleteCategory(categoryId: string) {
  const { error } = await supabase
    .from('global_categories')
    .delete()
    .eq('id', categoryId);

  if (error) {
    console.error('Errore nella cancellazione della categoria:', error);
    return true;
  }
  return false;
}

// ---------------------------------------------------------
// COMMENTS
// ---------------------------------------------------------
export async function getComments() {
  const { data, error } = await supabase.from('global_comments').select('*');
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

export async function updateComment(commentId: string, updates: any) {
  const { data, error } = await supabase
    .from('global_comments')
    .update(updates)
    .eq('id', commentId)
    .select()
    .single();

  if (error) {
    console.error("Errore nell'aggiornamento del commento:", error);
    return null;
  }
  return data;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from('global_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Errore nella cancellazione del commento:', error);
    return true;
  }
  return false;
}

// ---------------------------------------------------------
// UNICO oggetto + UNICO default export
// ---------------------------------------------------------
const storage = {
  // businesses
  getBusinesses,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  // users
  getUsers,
  addUser,
  updateUser,
  // categories
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  // comments
  getComments,
  addComment,
  updateComment,
  deleteComment,
};

export default storage;

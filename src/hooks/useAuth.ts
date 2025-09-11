import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { storageManager } from '../lib/storage';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Inizializza il sistema di storage
    storageManager.initialize();
    
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('borgo_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          loading: false,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('borgo_user');
        setState({
          user: null,
          loading: false,
          error: null
        });
      }
    } else {
      setState({
        user: null,
        loading: false,
        error: null
      });
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Check for Manager credentials
    if (email === 'manager' && password === 'manager2025@') {
      const managerUser: User = {
        id: 'manager-001',
        email: 'manager@app.internal',
        name: 'App Manager',
        created_at: new Date().toISOString(),
        user_type: 'manager'
      };
      
      localStorage.setItem('borgo_user', JSON.stringify(managerUser));
      setState({
        user: managerUser,
        loading: false,
        error: null
      });
      
      return { success: true };
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('borgo_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('borgo_user', JSON.stringify(userWithoutPassword));
      setState({
        user: userWithoutPassword,
        loading: false,
        error: null
      });
      return { success: true };
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Email o password non corretti'
      }));
      return { success: false, error: 'Email o password non corretti' };
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    user_type: 'customer' | 'business_owner';
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get existing users from storage manager
    const users = storageManager.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Email già registrata'
      }));
      return { success: false, error: 'Email già registrata' };
    }

    // Create new user
    const newUser = {
      email: userData.email,
      name: userData.name,
      user_type: userData.user_type,
      password: userData.password
    };

    // Save using storage manager
    storageManager.addUser(newUser);

    // Login the user
    const savedUsers = storageManager.getUsers();
    const savedUser = savedUsers.find(u => u.email === userData.email);
    const { password: _, ...userWithoutPassword } = savedUser;
    
    localStorage.setItem('borgo_user', JSON.stringify(userWithoutPassword));
    
    setState({
      user: userWithoutPassword,
      loading: false,
      error: null
    });

    return { success: true };
  };

  const updateUserType = async (newUserType: 'customer' | 'business_owner') => {
    if (!state.user) return { success: false, error: 'Utente non loggato' };

    const updatedUser = { ...state.user, user_type: newUserType };
    
    // Update in localStorage
    localStorage.setItem('borgo_user', JSON.stringify(updatedUser));
    
    // Update using storage manager
    storageManager.updateUser(state.user.id, { user_type: newUserType });

    setState(prev => ({
      ...prev,
      user: updatedUser
    }));

    return { success: true };
  };

  const signOut = async () => {
    localStorage.removeItem('borgo_user');
    setState({
      user: null,
      loading: false,
      error: null
    });
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateUserType,
  };
};
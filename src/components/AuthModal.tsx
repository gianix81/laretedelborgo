import React, { useState } from 'react';
import { X, User, Mail, Lock, Crown, Building2, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (userData: {
    name: string;
    email: string;
    password: string;
    user_type: 'customer' | 'business_owner';
  }) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  error: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSignIn, 
  onSignUp, 
  loading, 
  error 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showManagerAccess, setShowManagerAccess] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [managerCredentials, setManagerCredentials] = useState({
    username: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'customer' as 'customer' | 'business_owner'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      const result = await onSignIn(formData.email, formData.password);
      if (result.success) {
        onClose();
        setFormData({ name: '', email: '', password: '', confirmPassword: '', user_type: 'customer' });
      }
    } else {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      if (formData.password.length < 6) {
        return;
      }

      const result = await onSignUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: formData.user_type
      });
      
      if (result.success) {
        onClose();
        setFormData({ name: '', email: '', password: '', confirmPassword: '', user_type: 'customer' });
      }
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({ name: '', email: '', password: '', confirmPassword: '', user_type: 'customer' });
    setShowManagerAccess(false);
    setClickCount(0);
    setManagerCredentials({ username: '', password: '' });
  };

  const handleLogoClick = () => {
    if (mode !== 'login') return;
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 7) {
      setShowManagerAccess(true);
      setClickCount(0);
    }
    
    // Reset counter after 3 seconds of inactivity
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  const handleManagerLogin = async () => {
    if (managerCredentials.username === 'manager' && managerCredentials.password === 'manager2025@') {
      const result = await onSignIn('manager', 'manager2025@');
      if (result.success) {
        onClose();
        setManagerCredentials({ username: '', password: '' });
        setShowManagerAccess(false);
        setClickCount(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-orange-200 transition-colors"
                onClick={handleLogoClick}
                title={mode === 'login' ? `Click ${7 - clickCount} volte per accesso speciale` : ''}
              >
                {mode === 'login' ? (
                  <User className="w-5 h-5 text-orange-600" />
                ) : (
                  <UserCheck className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Accedi' : 'Registrati'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' 
                    ? 'Benvenuto nella Rete del Borgo' 
                    : 'Unisciti alla nostra comunità'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Mario Rossi"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="mario@esempio.it"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conferma Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">Le password non coincidono</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo di Account
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="user_type"
                        value="customer"
                        checked={formData.user_type === 'customer'}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value as any }))}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Cliente</div>
                        <div className="text-sm text-gray-600">Esplora e scopri attività locali</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="user_type"
                        value="business_owner"
                        checked={formData.user_type === 'business_owner'}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value as any }))}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <Building2 className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900">Esercente/Professionista</div>
                        <div className="text-sm text-gray-600">Gestisci la tua attività commerciale</div>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'login' ? 'Accesso in corso...' : 'Registrazione in corso...'}
                </div>
              ) : (
                mode === 'login' ? 'Accedi' : 'Registrati'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}
            </p>
            <button
              onClick={switchMode}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              {mode === 'login' ? 'Registrati qui' : 'Accedi qui'}
            </button>
          </div>

          {/* Hidden Manager Access - Click 7 times on logo to reveal */}
          {showManagerAccess && mode === 'login' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700">
                <h4 className="font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  Area Riservata Manager
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Username Manager
                    </label>
                    <input
                      type="text"
                      value={managerCredentials.username}
                      onChange={(e) => setManagerCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Password Manager
                    </label>
                    <input
                      type="password"
                      value={managerCredentials.password}
                      onChange={(e) => setManagerCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Password"
                    />
                  </div>
                  <button
                    onClick={handleManagerLogin}
                    disabled={loading || !managerCredentials.username || !managerCredentials.password}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded text-sm font-medium transition-colors"
                  >
                    {loading ? 'Accesso...' : 'Accedi come Manager'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
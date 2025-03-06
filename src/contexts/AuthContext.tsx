import { createContext, useState, useContext, ReactNode } from 'react';
import { authService } from '../services/api';
import { User } from '../types';

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Valor padrão do contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Provider para englobar a aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      console.log('Login bem-sucedido:', response);
      
      // Se o login foi bem-sucedido, armazena os dados do usuário
      if (response.user) {
        setUser(response.user);
      } else {
        // Se não recebeu os dados do usuário, busca-os
        const users = await authService.getUsers();
        const loggedUser = users.find((u: User) => u.email === email);
        
        if (loggedUser) {
          setUser(loggedUser);
        } else {
          throw new Error('Não foi possível obter os dados do usuário');
        }
      }
    } catch (err: any) {
      console.error('Erro no contexto de auth:', err);
      
      if (err.response) {
        setError(err.response.data?.error || 'Falha na autenticação');
      } else if (err.request) {
        setError('Não foi possível conectar ao servidor');
      } else {
        setError(err.message || 'Erro inesperado durante o login');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        error, 
        login, 
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 
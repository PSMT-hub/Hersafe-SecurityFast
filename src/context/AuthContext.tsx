import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginUser, registerUser, getProfile } from '../services/userService';
import type { ApiUser, RegisterPayload } from '../types/user';

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = '@hersafe:token';

function normalizeUser(usuario: ApiUser): ApiUser {
  return {
    ...usuario,
    id: usuario.id ?? usuario._id ?? '',
    meusLocais: usuario.meusLocais ?? [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos do contexto
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthContextData {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  /** true enquanto valida o token salvo na inicialização do app */
  isBootstrapping: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (dados: Omit<RegisterPayload, 'meusLocais'>) => Promise<void>;
  logout: () => Promise<void>;
  /** Atualiza os dados do user no contexto após um PUT bem-sucedido */
  refreshUser: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // ── Inicialização: valida token salvo ─────────────────────────────────────
  // Fluxo: abre o app → tem token? → GET /perfil → ok? → Home : Login
  useEffect(() => {
    async function bootstrap() {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (savedToken) {
          const { usuario } = await getProfile(savedToken);
          setToken(savedToken);
          setUser(normalizeUser(usuario));
        }
      } catch {
        // Token expirado ou inválido — limpa e vai para Login
        await AsyncStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsBootstrapping(false);
      }
    }
    bootstrap();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token: newToken, usuario } = await loginUser(email, password);
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(normalizeUser(usuario));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (dados: Omit<RegisterPayload, 'meusLocais'>) => {
    setIsLoading(true);
    try {
      const { token: newToken, usuario } = await registerUser({
        ...dados,
        meusLocais: [],
      });
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(normalizeUser(usuario));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // ── Refresh do perfil (pós-atualização) ───────────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const { usuario } = await getProfile(token);
      setUser(normalizeUser(usuario));
    } catch {
      // Se falhar (ex: token expirou), faz logout silencioso
      await logout();
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isBootstrapping,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextData {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}

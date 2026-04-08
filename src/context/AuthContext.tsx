import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';


export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  cpf?: string;
}

export interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data  →  substituir por chamadas reais à API futuramente
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_USER: User = {
  id: '1',
  name: 'Ana Silva',
  email: 'ana@hersafe.com',
  phone: '+55 11 99999-9999',
  avatarUrl: undefined,
};

// Credenciais mockadas para login
const MOCK_CREDENTIALS = {
  email: 'ana@hersafe.com',
  password: '123456',
};

// Simula latência de rede
const fakeDelay = (ms = 1000) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Login ────────────────────────────────────────────────────────────────
  // TODO: substituir por POST /auth/login  →  salvar token no SecureStore
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await fakeDelay();

      if (
        email.trim().toLowerCase() !== MOCK_CREDENTIALS.email ||
        password !== MOCK_CREDENTIALS.password
      ) {
        throw new Error('E-mail ou senha incorretos.');
      }

      setUser(MOCK_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────
  // TODO: substituir por POST /auth/register  →  salvar token no SecureStore
  const register = useCallback(
    async (name: string, email: string, _password: string, phone?: string) => {
      setIsLoading(true);
      try {
        await fakeDelay();

        // Simulação: qualquer registro bem-sucedido cria o usuário
        const newUser: User = {
          id: String(Date.now()),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone,
        };

        setUser(newUser);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ── Logout ───────────────────────────────────────────────────────────────
  // TODO: limpar token do SecureStore e invalidar sessão no backend
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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

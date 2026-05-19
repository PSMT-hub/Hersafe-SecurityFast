import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import { getUnreadNotificationsCount } from '../services/notificationService';

interface NotificationContextData {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await getUnreadNotificationsCount(token);
      setUnreadCount(data.naoLidas);
    } catch (error) {
      console.warn('Erro ao carregar total de notificacoes:', error);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    refreshUnreadCount();

    if (!token || !isAuthenticated) return;

    const intervalId = setInterval(refreshUnreadCount, 15000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, refreshUnreadCount, token]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextData {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications deve ser usado dentro de <NotificationProvider>');
  return ctx;
}

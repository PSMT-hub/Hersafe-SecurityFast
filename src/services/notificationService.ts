import { apiFetch } from './api';
import { AppNotification } from '../types/notification';

const BASE = '/notificacoes';

export async function getNotifications(token: string): Promise<{
  total: number;
  naoLidas: number;
  notificacoes: AppNotification[];
}> {
  return apiFetch(`${BASE}`, { token });
}

export async function getUnreadNotificationsCount(token: string): Promise<{ naoLidas: number }> {
  return apiFetch(`${BASE}/nao-lidas`, { token });
}

export async function markNotificationAsRead(
  id: string,
  token: string
): Promise<{ mensagem: string; notificacao: AppNotification }> {
  return apiFetch(`${BASE}/${id}/lida`, {
    method: 'PUT',
    token,
  });
}

export async function markAllNotificationsAsRead(token: string): Promise<{ mensagem: string }> {
  return apiFetch(`${BASE}/lidas`, {
    method: 'PUT',
    token,
  });
}

export async function triggerEmergency(token: string): Promise<{
  mensagem: string;
  totalDestinatarios: number;
}> {
  return apiFetch(`${BASE}/emergencia`, {
    method: 'POST',
    token,
  });
}

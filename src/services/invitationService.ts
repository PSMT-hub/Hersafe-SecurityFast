import { apiFetch } from './api';
import { Invitation } from '../types/group';

const BASE = '/convites';

export async function sendInvitation(destinatarioId: string, grupoId: string, token: string): Promise<{ mensagem: string, convite: Invitation }> {
  return apiFetch<{ mensagem: string, convite: Invitation }>(BASE, {
    method: 'POST',
    body: { destinatarioId, grupoId },
    token,
  });
}

export async function getPendingInvitations(token: string): Promise<{ total: number; convites: Invitation[] }> {
  return apiFetch<{ total: number; convites: Invitation[] }>(`${BASE}/pendentes`, { token });
}

export async function respondInvitation(id: string, status: 'aceito' | 'recusado', token: string): Promise<{ mensagem: string, convite: Invitation }> {
  return apiFetch<{ mensagem: string, convite: Invitation }>(`${BASE}/${id}/responder`, {
    method: 'PUT',
    body: { status },
    token,
  });
}

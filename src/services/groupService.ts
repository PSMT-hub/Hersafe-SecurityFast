import { apiFetch } from './api';
import { Group } from '../types/group';

const BASE = '/grupos';

export async function createGroup(nome: string, descricao: string, token: string): Promise<{ mensagem: string, grupo: Group }> {
  return apiFetch<{ mensagem: string, grupo: Group }>(BASE, {
    method: 'POST',
    body: { nome, descricao },
    token,
  });
}

export async function getGroups(token: string): Promise<{ total: number; grupos: Group[] }> {
  return apiFetch<{ total: number; grupos: Group[] }>(BASE, { token });
}

export async function getGroupById(id: string, token: string): Promise<{ grupo: Group }> {
  return apiFetch<{ grupo: Group }>(`${BASE}/${id}`, { token });
}

export async function removeMember(groupId: string, memberId: string, token: string): Promise<{ mensagem: string, grupo: Group }> {
  return apiFetch<{ mensagem: string, grupo: Group }>(`${BASE}/${groupId}/membros/${memberId}`, {
    method: 'DELETE',
    token,
  });
}

export async function deleteGroup(id: string, token: string): Promise<{ mensagem: string }> {
  return apiFetch<{ mensagem: string }>(`${BASE}/${id}`, {
    method: 'DELETE',
    token,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// userService.ts — Todas as chamadas ao endpoint /api/usuarios
// ─────────────────────────────────────────────────────────────────────────────

import { apiFetch } from './api';
import type {
  AuthResponse,
  ProfileResponse,
  UpdateResponse,
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
} from '../types/user';

const BASE = '/usuarios';

// ─── Rotas públicas ───────────────────────────────────────────────────────────

/**
 * POST /api/usuarios/login
 * Autentica o usuário e retorna token + dados do usuário.
 */
export async function loginUser(
  email: string,
  senha: string
): Promise<AuthResponse> {
  const payload: LoginPayload = { email, senha };
  return apiFetch<AuthResponse>(`${BASE}/login`, {
    method: 'POST',
    body: payload,
  });
}

/**
 * POST /api/usuarios/registro
 * Cria uma nova conta e retorna token + dados do usuário.
 */
export async function registerUser(
  dados: RegisterPayload
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(`${BASE}/registro`, {
    method: 'POST',
    body: dados,
  });
}

// ─── Rotas protegidas (exigem token) ─────────────────────────────────────────

/**
 * GET /api/usuarios/perfil 🔒
 * Retorna os dados do usuário autenticado pelo token.
 * Útil para validar sessão na inicialização do app.
 */
export async function getProfile(token: string): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(`${BASE}/perfil`, { token });
}

/**
 * GET /api/usuarios/:id 🔒
 * Busca um usuário específico pelo ID.
 */
export async function getUserById(
  id: string,
  token: string
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(`${BASE}/${id}`, { token });
}

/**
 * PUT /api/usuarios/:id 🔒
 * Atualiza os dados do usuário logado.
 */
export async function updateUser(
  id: string,
  dados: UpdateUserPayload,
  token: string
): Promise<UpdateResponse> {
  return apiFetch<UpdateResponse>(`${BASE}/${id}`, {
    method: 'PUT',
    body: dados,
    token,
  });
}

/**
 * DELETE /api/usuarios/:id 🔒
 * Deleta a conta do usuário logado.
 */
export async function deleteUser(
  id: string,
  token: string
): Promise<{ mensagem: string }> {
  return apiFetch<{ mensagem: string }>(`${BASE}/${id}`, {
    method: 'DELETE',
    token,
  });
}

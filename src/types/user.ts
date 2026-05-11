// ─────────────────────────────────────────────────────────────────────────────
// Tipos alinhados ao modelo da API HERSAFE
// ─────────────────────────────────────────────────────────────────────────────

export interface EmergencyContact {
  nome: string;
  telefone: string;
}

export interface MyLocation {
  _id?: string;
  nome: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
}

/** Modelo retornado pela API (campo `senha` nunca é retornado) */
export interface ApiUser {
  _id?: string;
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  contatoDeEmergencia?: EmergencyContact;
  meusLocais: MyLocation[];
  createdAt?: string;
  updatedAt?: string;
}

// ─── Payloads de requisição ───────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  contatoDeEmergencia?: EmergencyContact;
  meusLocais?: MyLocation[];
}

export interface UpdateUserPayload {
  nome?: string;
  email?: string;
  telefone?: string;
  contatoDeEmergencia?: EmergencyContact;
  meusLocais?: MyLocation[];
}

// ─── Respostas da API ─────────────────────────────────────────────────────────

export interface AuthResponse {
  mensagem: string;
  token: string;
  usuario: ApiUser;
}

export interface ProfileResponse {
  usuario: ApiUser;
}

export interface UpdateResponse {
  mensagem: string;
  usuario: ApiUser;
}

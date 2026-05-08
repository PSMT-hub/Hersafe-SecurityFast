// ─────────────────────────────────────────────────────────────────────────────
// api.ts — Cliente HTTP central do HERSAFE
//
// Para trocar para produção, basta alterar BASE_URL.
// ─────────────────────────────────────────────────────────────────────────────

/** URL base da API. Troque para o endereço de produção antes do deploy. */
export const BASE_URL = 'http://192.168.0.243:3000/api';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

/**
 * Wrapper sobre fetch com:
 *  - baseURL automática
 *  - header `Content-Type: application/json`
 *  - header `Authorization: Bearer <token>` quando fornecido
 *  - throw de Error com a mensagem do backend em caso de resposta não-OK
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Tenta parsear o JSON independente do status
  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Lança o erro com a mensagem padronizada do backend
    const mensagem =
      data?.mensagem ?? `Erro ${response.status}: ${response.statusText}`;
    throw new Error(mensagem);
  }

  return data as T;
}

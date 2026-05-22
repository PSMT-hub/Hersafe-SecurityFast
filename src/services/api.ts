// ─────────────────────────────────────────────────────────────────────────────
// api.ts — Cliente HTTP central do HERSAFE
//
// Para trocar para produção, basta alterar BASE_URL.
// ─────────────────────────────────────────────────────────────────────────────

import Constants from 'expo-constants';
import { Platform } from 'react-native';

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

const API_PORT = 3000;
const API_PATH = '/api';
const REQUEST_TIMEOUT_MS = 10000;

function getExpoHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ?? Constants.manifest?.hostUri ?? Constants.linkingUri;

  if (!hostUri) return null;

  const host = hostUri
    .replace(/^https?:\/\//, '')
    .replace(/^exp:\/\//, '')
    .replace(/^exps:\/\//, '')
    .split('/')[0]
    .split(':')[0];

  return host || null;
}

const DEFAULT_API_HOST = Platform.OS === 'web' ? 'localhost' : getExpoHost();

export const BASE_URL = (
  process?.env?.EXPO_PUBLIC_API_URL ??
  `http://${DEFAULT_API_HOST ?? 'localhost'}:${API_PORT}${API_PATH}`
).replace(/\/$/, '');

let activeBaseUrl = BASE_URL;

console.log(`[HERSAFE API] URL inicial: ${BASE_URL}`);

function getFallbackBaseUrl(): string {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${API_PORT}${API_PATH}`;
}

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
export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${activeBaseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error: any) {
    const fallbackUrl = getFallbackBaseUrl();
    const isTimeout = error?.name === 'AbortError';

    if (!isTimeout && activeBaseUrl !== fallbackUrl) {
      console.warn(`[apiFetch] Falha ao conectar em ${activeBaseUrl}. Tentando fallback local: ${fallbackUrl}`);
      try {
        response = await fetch(`${fallbackUrl}${path}`, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
        activeBaseUrl = fallbackUrl;
        console.log(`[apiFetch] Fallback local funcionou! Nova URL base ativa: ${activeBaseUrl}`);
      } catch (fallbackError) {
        console.error(`[apiFetch] Ambos falharam (${activeBaseUrl} e ${fallbackUrl})`);
        throw new Error(
          `Nao foi possivel conectar a API em ${activeBaseUrl} ou no fallback (${fallbackUrl}). Verifique se o backend esta rodando.`
        );
      }
    } else {
      const reason = isTimeout ? 'tempo limite excedido' : 'falha de conexao';
      throw new Error(
        `Nao foi possivel conectar a API em ${activeBaseUrl} (${reason}). Verifique se o backend esta rodando e se o celular/emulador esta na mesma rede.`
      );
    }
  } finally {
    clearTimeout(timeoutId);
  }

  // Tenta parsear o JSON independente do status
  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Lança o erro com a mensagem padronizada do backend
    const mensagem = data?.mensagem ?? `Erro ${response.status}: ${response.statusText}`;
    throw new Error(mensagem);
  }

  return data as T;
}

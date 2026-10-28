/**
 * Shared HTTP client for the Sakinah backend.
 *
 * - Builds absolute URLs from `EXPO_PUBLIC_API_BASE_URL` with a hard fallback,
 *   so a missing env var can never turn a request into a relative URL (which
 *   would hit the Metro dev server and return HTML instead of JSON).
 * - Attaches `Authorization: Bearer <guest_token>` from AsyncStorage when a
 *   token has been stored (the guest identity flow writes it on first launch).
 * - Logs request metadata without logging response bodies or credentials.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "@/lib/constants";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Attach the stored bearer token. Defaults to `true`. */
  auth?: boolean;
  /** Additional headers for APIs that use a custom guest-token header. */
  headers?: Record<string, string>;
}

const FALLBACK_BASE_URL = "https://athkar-be.ofx-qrcode.com";

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const base = fromEnv && fromEnv.length > 0 ? fromEnv : FALLBACK_BASE_URL;
  return base.replace(/\/+$/, "");
}

export const API_BASE_URL = resolveBaseUrl();

function buildQuery(query?: Record<string, QueryValue>): string {
  if (!query) return "";
  const parts: string[] = [];
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    parts.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  });
  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

async function readGuestToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.guestToken);
  } catch (error) {
    console.error("[API] Failed to read guest token from storage:", error);
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, auth = true, headers: extraHeaders } = options;
  const url = `${API_BASE_URL}${path}${buildQuery(query)}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  Object.assign(headers, extraHeaders);
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await readGuestToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();

    if (__DEV__) console.log(`[API] ${method} ${path} → ${response.status}`);

    if (!contentType.includes("application/json")) {
      console.error(`[API] Non-JSON response for ${method} ${path}`, {
        status: response.status,
        contentType,
        preview: text.slice(0, 200),
      });
      throw new Error(
        `Expected JSON but got "${contentType || "unknown"}" (status ${response.status}). Response started with: ${text.slice(0, 120)}`,
      );
    }

    const json = (text ? JSON.parse(text) : null) as T & { message?: string };

    if (!response.ok) {
      const message =
        json?.message ?? `Request failed with status ${response.status}`;
      console.error(`[API] Request rejected: ${method} ${path} (${response.status})`);
      throw new Error(message);
    }

    return json as T;
  } catch (error) {
    if (__DEV__) console.error(`[API] Request failed ${method} ${path}:`, error);
    throw error;
  }
}

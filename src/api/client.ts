/**
 * Shared HTTP client for the Sakinah backend.
 *
 * - Builds absolute URLs from `EXPO_PUBLIC_API_BASE_URL` with a hard fallback,
 *   so a missing env var can never turn a request into a relative URL (which
 *   would hit the Metro dev server and return HTML instead of JSON).
 * - Attaches `Authorization: Bearer <guest_token>` from AsyncStorage when a
 *   token has been stored (the guest identity flow writes it on first launch).
 * - Logs every request, response and error to the console.
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
  const { method = "GET", body, query, auth = true } = options;
  const url = `${API_BASE_URL}${path}${buildQuery(query)}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await readGuestToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  console.log(`[API] → ${method} ${url}`, body !== undefined ? body : "");
  console.log("[API] → headers", {
    ...headers,
    Authorization: headers.Authorization ? "Bearer ***" : undefined,
  });

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();

    console.log(`[API] ← ${response.status} ${method} ${url}`);

    if (!contentType.includes("application/json")) {
      console.error(`[API] Non-JSON response for ${method} ${url}`, {
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
      console.error(`[API] ✗ ${method} ${url}`, json);
      throw new Error(message);
    }

    console.log(`[API] ✓ ${method} ${url}`, json);
    return json as T;
  } catch (error) {
    console.error(`[API] Request failed ${method} ${url}:`, error);
    throw error;
  }
}

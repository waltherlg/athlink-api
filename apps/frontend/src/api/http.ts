import { authPaths as authPathsShared } from '@shared-types';
import { setAccessToken } from '../features/auth/token-storage';

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3000';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

type ApiFetchOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

const authRefreshPath = `/${authPathsShared.controller}/${authPathsShared.refreshToken}`;
let refreshPromise: Promise<string | null> | null = null;

function notifyUnauthorized() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${authRefreshPath}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return null;
    }

    if (typeof data === 'object' && data && 'accessToken' in data) {
      const accessToken = (data as { accessToken: string }).accessToken;
      setAccessToken(accessToken);
      return accessToken;
    }

    return null;
  } catch {
    return null;
  }
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const { headers, skipAuthRefresh, ...rest } = options;
  const requestHeaders = new Headers(headers ?? {});
  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    credentials: rest.credentials ?? 'include',
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    path !== authRefreshPath &&
    requestHeaders.has('Authorization')
  ) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
      requestHeaders.set('Authorization', `Bearer ${newAccessToken}`);
      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: requestHeaders,
        credentials: rest.credentials ?? 'include',
      });

      const retryContentType = retryResponse.headers.get('content-type');
      const retryIsJson = retryContentType?.includes('application/json');
      const retryData = retryIsJson
        ? await retryResponse.json()
        : await retryResponse.text();

      if (!retryResponse.ok) {
        const error: ApiError = {
          message: typeof retryData === 'string' ? retryData : 'Request failed',
          status: retryResponse.status,
          details: typeof retryData === 'string' ? undefined : retryData,
        };
        if (
          retryResponse.status === 401 &&
          requestHeaders.has('Authorization')
        ) {
          notifyUnauthorized();
        }
        throw error;
      }

      return retryData as TResponse;
    }

    if (requestHeaders.has('Authorization')) {
      notifyUnauthorized();
    }
  }

  if (!response.ok) {
    const error: ApiError = {
      message: typeof data === 'string' ? data : 'Request failed',
      status: response.status,
      details: typeof data === 'string' ? undefined : data,
    };
    if (response.status === 401 && requestHeaders.has('Authorization')) {
      notifyUnauthorized();
    }
    throw error;
  }

  return data as TResponse;
}

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:3000';

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

export async function apiFetch<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error: ApiError = {
      message: typeof data === 'string' ? data : 'Request failed',
      status: response.status,
      details: typeof data === 'string' ? undefined : data,
    };
    throw error;
  }

  return data as TResponse;
}

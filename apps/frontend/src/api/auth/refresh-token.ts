import { API_BASE_URL } from '../http';
import { authPaths } from './paths';

export async function refreshAccessToken() {
  const response = await fetch(`${API_BASE_URL}${authPaths.refreshToken}`, {
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
    return (data as { accessToken: string }).accessToken;
  }

  return null;
}

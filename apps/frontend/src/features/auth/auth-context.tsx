import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { LoginInput, LoginResponse, UserNameResponse } from '@shared-types';
import { loginUser } from '../../api/auth/login';
import { logoutUser } from '../../api/auth/logout';
import { getMe } from '../../api/auth/me';
import { refreshAccessToken } from '../../api/auth/refresh-token';
import { AUTH_UNAUTHORIZED_EVENT } from '../../api/http';
import {
  clearTokens,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from './token-storage';

type AuthContextValue = {
  userName: UserNameResponse;
  isChecking: boolean;
  login: (input: LoginInput) => Promise<LoginResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authError: 'unauthorized' | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<UserNameResponse>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<'unauthorized' | null>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const refreshInFlightRef = useRef(false);

  const stopSilentRefresh = useCallback(() => {
    if (refreshTimerRef.current !== null) {
      window.clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const startSilentRefresh = useCallback(() => {
    stopSilentRefresh();
    if (!getAccessToken()) {
      return;
    }

    refreshTimerRef.current = window.setInterval(async () => {
      if (refreshInFlightRef.current) {
        return;
      }

      refreshInFlightRef.current = true;
      const newAccessToken = await refreshAccessToken();
      refreshInFlightRef.current = false;

      if (newAccessToken) {
        setAccessToken(newAccessToken);
        setAuthError(null);
        return;
      }

      // Refresh failed -> stop timer to avoid infinite loop
      stopSilentRefresh();
      clearTokens();
      setUserName(null);
      setAuthError('unauthorized');
    }, 5 * 60 * 1000);
  }, [stopSilentRefresh]);

  const refreshUser = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      stopSilentRefresh();
      setUserName(null);
      setIsChecking(false);
      return;
    }

    try {
      const response = await getMe(accessToken);
      setUserName(response ?? null);
    } catch {
      stopSilentRefresh();
      clearTokens();
      setUserName(null);
    } finally {
      setIsChecking(false);
    }
  }, [stopSilentRefresh]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    startSilentRefresh();
    return () => {
      stopSilentRefresh();
    };
  }, [startSilentRefresh, stopSilentRefresh]);

  useEffect(() => {
    function handleUnauthorized() {
      stopSilentRefresh();
      clearTokens();
      setUserName(null);
      setAuthError('unauthorized');
      setIsChecking(false);
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await loginUser(input);
      setAccessToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      await refreshUser();
      setAuthError(null);
      startSilentRefresh();
      return response;
    },
    [refreshUser, startSilentRefresh],
  );

  const logout = useCallback(() => {
    void logoutUser().catch(() => undefined);
    stopSilentRefresh();
    clearTokens();
    setUserName(null);
    setAuthError(null);
  }, [stopSilentRefresh]);

  return (
    <AuthContext.Provider
      value={{ userName, isChecking, login, logout, refreshUser, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

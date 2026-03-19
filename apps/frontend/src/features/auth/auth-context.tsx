import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { LoginInput, LoginResponse, UserNameResponse } from '@shared-types';
import { loginUser } from '../../api/auth/login';
import { getMe } from '../../api/auth/me';
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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<UserNameResponse>(null);
  const [isChecking, setIsChecking] = useState(true);

  const refreshUser = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setUserName(null);
      setIsChecking(false);
      return;
    }

    try {
      const response = await getMe(accessToken);
      setUserName(response ?? null);
    } catch {
      clearTokens();
      setUserName(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await loginUser(input);
      setAccessToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      await refreshUser();
      return response;
    },
    [refreshUser],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUserName(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ userName, isChecking, login, logout, refreshUser }}
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

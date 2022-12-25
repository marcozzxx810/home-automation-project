import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthContextType {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  initialLoading: boolean;
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: any;
  setError: React.Dispatch<any>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem('username') || 'null');
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || 'null');
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken') || 'null');
    console.log(accessToken);
    if (username && accessToken && refreshToken) {
      setUser({
        username,
        accessToken,
        refreshToken,
      });
    }
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    if (user?.username && user?.accessToken && user?.refreshToken) {
      localStorage.setItem('username', JSON.stringify(user.username));
      localStorage.setItem('accessToken', JSON.stringify(user.accessToken));
      localStorage.setItem('refreshToken', JSON.stringify(user.refreshToken));
    }
  }, [user]);

  const memoedValue = useMemo(
    () => ({
      user,
      setUser,
      error,
      setError,
      initialLoading,
      setInitialLoading,
      loading,
      setLoading,
    }),
    [error, initialLoading, loading, user],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {(location.pathname === '/' || !initialLoading) && children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}

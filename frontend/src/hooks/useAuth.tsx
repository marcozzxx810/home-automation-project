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
    // bypass Login
    setUser({
      username: 'hi',
    });
    setInitialLoading(false);
  }, []);

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

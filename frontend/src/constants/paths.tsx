import Login from '@/pages/Login';
import { lazyLoadRoutes } from '@/router/LazyLoadRoutes';
import { ProtectedRoute } from '@/router/ProtectedRoute';

export const paths = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/home',
        element: lazyLoadRoutes('Home'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    element: lazyLoadRoutes('Login'),
  },
  {
    path: '/signup',
    name: 'Sign Up',
    element: lazyLoadRoutes('SignUp'),
  },
];

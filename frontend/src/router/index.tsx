import { useRoutes } from 'react-router-dom';

import { paths } from '@/constants/paths';

import { lazyLoadRoutes } from './LazyLoadRoutes';

export function Router() {
  return useRoutes(paths);
}

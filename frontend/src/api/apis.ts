import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (config) => config,
  (error) => Promise.reject(error),
);

export const apis = (instance: AxiosInstance) => {
  return {
    request: <T = any>(config: AxiosRequestConfig): Promise<T> => {
      return instance.request<T, T>(config);
    },
    get: <T = any>(route: string, config?: AxiosRequestConfig): Promise<T> => {
      return instance.get<T, T>(route, config);
    },
    post: <T = any>(
      route: string,
      data: any,
      config?: AxiosRequestConfig,
    ): Promise<T> => {
      return instance.post<T, T>(route, data, config);
    },
    put: <T = any>(route: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
      return instance.put<T, T>(route, data, config);
    },
    patch: <T = any>(
      route: string,
      data: any,
      config?: AxiosRequestConfig,
    ): Promise<T> => {
      return instance.patch<T, T>(route, data, config);
    },
    head: <T = any>(route: string, config?: AxiosRequestConfig): Promise<T> => {
      return instance.head<T, T>(route, config);
    },
    options: <T = any>(route: string, config?: AxiosRequestConfig): Promise<T> => {
      return instance.options<T, T>(route, config);
    },
    delete: <T = any>(route: string, config?: AxiosRequestConfig): Promise<T> => {
      return instance.delete<T, T>(route, config);
    },
  };
};

export default {
  instance,
  ...apis(instance),
};

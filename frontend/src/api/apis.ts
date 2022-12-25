import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// set access token
instance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || '{}');
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// refresh token api

function refreshToken() {
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken') || 'null');

  if (refreshToken) {
    return instance.post('/auth/token/refresh/', {
      refresh: refreshToken,
    });
  }

  throw new Error('No refresh Token in local storage');
}

// refresh access token

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const res = await refreshToken();
          const { accessToken } = res.data;
          localStorage.setItem('accessToken', JSON.stringify(accessToken));
          instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          return instance(originalConfig);
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  },
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

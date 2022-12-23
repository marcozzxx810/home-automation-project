import { AxiosError, AxiosResponse } from 'axios';

import api from '@/api/apis';

/**
 * Auth
 */

interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await api.post('/auth/token/', { username, password });
  return res.data;
};

export const register = async (
  email: string,
  username: string,
  password: string,
  is_staff: boolean,
  passcode: string,
): Promise<AxiosResponse> => {
  try {
    const res = await api.post('/auth/register/', {
      email,
      username,
      password,
      is_staff,
      passcode,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error.response;
  }
};

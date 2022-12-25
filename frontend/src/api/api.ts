import { AxiosError, AxiosResponse } from 'axios';
import { Dayjs } from 'dayjs';

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

/**
 * Blood Record
 */

export const createBloodPressureRecord = async (
  recordDate: Dayjs,
  systolicPressure: number,
  diastolicPressure: number,
  pulse: number,
) => {
  try {
    const res = await api.post('/api/bloodPressure/', {
      systolic_pressure: systolicPressure,
      diastolic_pressure: diastolicPressure,
      pulse,
      created_at: recordDate.toISOString(),
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error.response;
  }
};

export const getBloodPressureRecord = async () => {
  try {
    const res = await api.get('/api/bloodPressure/');
    return res;
  } catch (error: any) {
    console.log(error);
    return error.response;
  }
};

export const deleteBloodPressureRecord = async (id: number) => {
  try {
    const res = await api.delete('/api/bloodPressure/', {
      data: {
        id,
      },
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error.response;
  }
};

export const getBloodPressureRecordById = async (id: number) => {
  try {
    const res = await api.get(`/api/bloodPressure/?id=${id}`);
    return res;
  } catch (error: any) {
    console.log(error);
    return error.response;
  }
};

export const updateBloodPressureRecord = async (
  id: number,
  recordDate: Dayjs,
  systolicPressure: number,
  diastolicPressure: number,
  pulse: number,
) => {
  try {
    const res = await api.put('/api/bloodPressure/', {
      id,
      systolic_pressure: systolicPressure,
      diastolic_pressure: diastolicPressure,
      pulse,
      created_at: recordDate.toISOString(),
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error.response;
  }
};

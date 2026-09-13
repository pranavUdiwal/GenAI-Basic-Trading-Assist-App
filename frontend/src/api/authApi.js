import axiosClient from './axiosClient';

export const signup = async ({ name, email, password }) => {
  const { data } = await axiosClient.post('/auth/signup', { name, email, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await axiosClient.post('/auth/logout');
  return data;
};

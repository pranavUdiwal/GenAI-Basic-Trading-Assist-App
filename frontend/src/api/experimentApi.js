import axiosClient from './axiosClient';

export const postExperiment = async (conversation) => {
  const { data } = await axiosClient.post('/conversation/experiment', { conversation });
  return data;
};

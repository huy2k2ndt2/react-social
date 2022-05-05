import axiosInstance from "../config/axiosInstance ";

export const getDataAPI = async (url) => {

  const res = await axiosInstance.get(`${url}`);
  return res;
};

export const postDataAPI = async (url, data) => {
  const res = await axiosInstance.post(`${url}`, data);
  return res;
};

export const putDataAPI = async (url, data) => {
  const res = await axiosInstance.put(`${url}`, data);
  return res;
};

export const patchDataAPI = async (url, data) => {
  const res = await axiosInstance.patch(`${url}`, data);
  return res;
};

export const deleteDataAPI = async (url) => {
  const res = await axiosInstance.delete(`${url}`);
  return res;
};

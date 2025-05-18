import axiosInstance from "lib/axiosInstance";
import { generateParamsString, getToken } from "utils/helper";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const createTraining = async (body) => {
  const { data } = await axiosInstance.post(
    "/v1/trainings/createTraining",
    body,
    getAuthHeaders()
  );
  return data;
};

export const getAllTrainings = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/trainings/getAllTrainings?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const getTrainingById = async (id) => {
  const { data } = await axiosInstance.get(
    `/v1/trainings/getTrainingById/${id}`,
    getAuthHeaders()
  );
  return data;
};

export const updateTraining = async (body) => {
  const { _id, ...rest } = body;
  const { data } = await axiosInstance.put(
    `/v1/trainings/updateTraining/${_id}`,
    rest,
    getAuthHeaders()
  );
  return data;
};

export const deleteTraining = async (id) => {
  const { data } = await axiosInstance.delete(
    `/v1/trainings/deleteTraining/${id}`,
    getAuthHeaders()
  );
  return data;
};

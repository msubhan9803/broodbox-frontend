import axiosInstance from "lib/axiosInstance";
import { generateParamsString, getToken } from "utils/helper";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const createCamera = async (body) => {
  const { data } = await axiosInstance.post(
    "/v1/camera/createCamera",
    body,
    getAuthHeaders()
  );
  return data;
};

export const getAllcameras = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/camera/getAllcameras?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const getCameraById = async (id) => {
  const { data } = await axiosInstance.get(
    `/v1/camera/getCameraById/${id}`,
    getAuthHeaders()
  );
  return data;
};

export const updateCamera = async (body) => {
  const { _id, ...rest } = body;
  const { data } = await axiosInstance.put(
    `/v1/camera/updateCamera/${_id}`,
    rest,
    getAuthHeaders()
  );
  return data;
};

export const deleteCamera = async (id) => {
  const { data } = await axiosInstance.delete(
    `/v1/camera/deleteCamera/${id}`,
    getAuthHeaders()
  );
  return data;
};

export const getUniqueCameraId = async () => {
  const { data } = await axiosInstance.get(
    "/v1/camera/getUniqueCameraId",
    getAuthHeaders()
  );
  return data;
};

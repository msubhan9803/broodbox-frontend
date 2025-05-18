import axiosInstance from "lib/axiosInstance";
import { getToken, generateParamsString } from "utils/helper";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAllUsers = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/users/getAllUsers?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const getUserById = async (userId) => {
  const { data } = await axiosInstance.get(
    `/v1/users/getUserById/${userId}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllUsersByRole = async (role) => {
  const { data } = await axiosInstance.get(
    `/v1/users/getAllUsersByRole/${role}`,
    getAuthHeaders()
  );
  return data;
};

export const getBusinessAccounts = async () => {
  const { data } = await axiosInstance.get(
    "/v1/users/getBusinessAccounts",
    getAuthHeaders()
  );
  return data;
};

export const createUser = async (userData) => {
  const { data } = await axiosInstance.post(
    "/v1/users/createUser",
    userData,
    getAuthHeaders()
  );
  return data;
};

export const updateUser = async ({ userId, userData }) => {
  const { data } = await axiosInstance.put(
    `/v1/users/updateUser`,
    { ...userData, userId },
    getAuthHeaders()
  );
  return data;
};

export const toggleUserAccountStatus = async (userId) => {
  const { data } = await axiosInstance.put(
    `/v1/users/toggleUserAccountStatus/${userId}`,
    {},
    getAuthHeaders()
  );
  return data;
};

export const toggleUserEmailVerification = async (userId) => {
  const { data } = await axiosInstance.put(
    `/v1/users/toggleUserEmailVerification/${userId}`,
    {},
    getAuthHeaders()
  );
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await axiosInstance.delete(
    `/v1/users/deleteUser/${userId}`,
    getAuthHeaders()
  );
  return data;
};

export const deleteBusinessAccountPermanantly = async (userId) => {
  const { data } = await axiosInstance.delete(
    `/v1/users/deleteBusinessAccountPermanantly/${userId}`,
    getAuthHeaders()
  );
  return data;
};

export const useUpdateCoverImg = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post(
    "/v1/users/updateCoverImg",
    formData,
    {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    }
  );
  return data;
};

export const useUpdateUserById = async (userData) => {
  const { data } = await axiosInstance.put(
    `/v1/users/updateUserById`,
    { ...userData },
    getAuthHeaders()
  );
  return data;
};

import axiosInstance from "lib/axiosInstance";
import { getToken, generateParamsString } from "utils/helper";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAllActivityLogs = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/activityLogs/getAllActivityLogs?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const createActivityLog = async (body) => {
  const { data } = await axiosInstance.post(
    `/v1/activityLogs/createActivityLog`,
    body,
    getAuthHeaders()
  );
  return data;
};

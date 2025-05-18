import axiosInstance from "lib/axiosInstance";
import { getToken, checkTokenExistence } from "utils/helper";

const getAuthHeaders = () => {
  if (!checkTokenExistence()) {
    throw new Error("No token found. User is not authenticated.");
  }

  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }
};

export const getAllModules = async () => {
  const { data } = await axiosInstance.get("/v1/usersManagement/getAllModules", getAuthHeaders());
  return data;
};

export const getAllRoles = async () => {
  const { data } = await axiosInstance.get("/v1/usersManagement/getAllRoles", getAuthHeaders());
  return data;
};

export const createRole = async (roleData) => {
  const { data } = await axiosInstance.post("/v1/usersManagement/createRole", roleData, getAuthHeaders());
  return data;
};

export const deleteRole = async (roleId) => {
  const { data } = await axiosInstance.delete(`/v1/usersManagement/deleteRole/${roleId}`, getAuthHeaders());
  return data;
};

export const createModule = async (moduleData) => {
  const { data } = await axiosInstance.post("/v1/usersManagement/createModule", moduleData, getAuthHeaders());
  return data;
};

export const updateRolePrivileges = async (privilegesData) => {
  const { data } = await axiosInstance.post("/v1/usersManagement/updateRolePrivileges", privilegesData, getAuthHeaders());
  return data;
};

export const getPrivilegesByRoleName = async (roleName) => {
  const { data } = await axiosInstance.get(`/v1/usersManagement/getPrivilegesByRoleName/${roleName}`, getAuthHeaders());
  return data;
};

export const getPrivilegesByRoleNameWithoutPopulation = async (roleName) => {
  const { data } = await axiosInstance.get(`/v1/usersManagement/getPrivilegesByRoleNameWithoutPopulation/${roleName}`, getAuthHeaders());
  return data;
};

export const createRoleWithModules = async (roleData, moduleList) => {
  const { data } = await axiosInstance.post("/v1/usersManagement/createRoleWithModules", {
    role: roleData,
    moduleList,
  }, getAuthHeaders());
  return data;
};

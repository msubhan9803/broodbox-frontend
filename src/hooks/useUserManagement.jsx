import { useQuery, useMutation, useQueryClient } from "react-query";
import * as userManagementApi from "api/userManagementApi";
import { userManagementQueryKeys } from "hooks/hookIdentifiers";

export const useAllModules = () => {
  return useQuery(
    userManagementQueryKeys.modules,
    userManagementApi.getAllModules
  );
};

export const useAllRoles = () => {
  return useQuery(userManagementQueryKeys.roles, userManagementApi.getAllRoles);
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation(userManagementApi.createRole, {
    onSuccess: () => {
      queryClient.invalidateQueries(userManagementQueryKeys.roles);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation(userManagementApi.deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries(userManagementQueryKeys.roles);
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation(userManagementApi.createModule, {
    onSuccess: () => {
      queryClient.invalidateQueries(userManagementQueryKeys.modules);
    },
  });
};

export const useUpdateRolePrivileges = () => {
  const queryClient = useQueryClient();
  return useMutation(userManagementApi.updateRolePrivileges, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        userManagementQueryKeys.privilegesByRoleNameWithoutPopulation
      );
    },
  });
};

export const useGetPrivilegesByRoleName = (roleName) => {
  return useQuery([userManagementQueryKeys.privileges, roleName], () =>
    userManagementApi.getPrivilegesByRoleName(roleName),
    {
      enabled: !!roleName,
    }
  );
};

export const useGetPrivilegesByRoleNameWithoutPopulation = (roleName) => {
  return (
    useQuery(
      [userManagementQueryKeys.privilegesByRoleNameWithoutPopulation, roleName],
      () => userManagementApi.getPrivilegesByRoleNameWithoutPopulation(roleName),
      {
        enabled: !!roleName,
      }
    )
  );
};

export const useCreateRoleWithModules = () => {
  return useMutation(userManagementApi.createRoleWithModules);
};

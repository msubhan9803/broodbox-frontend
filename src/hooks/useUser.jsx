import { useQuery, useMutation, useQueryClient } from "react-query";
import * as userApi from "api/userApi";
import * as authApi from "api/authApi";
import { userQueryKeys, farmQueryKeys } from "hooks/hookIdentifiers";

export const useAllUsers = ({
  search = "",
  sortBy = "createdAt_desc",
  page = 1,
  limit = 10,
  role,
  accountStatus,
}) => {
  const queryKey = [
    userQueryKeys.allUsers,
    { search, sortBy, page, limit, role, accountStatus },
  ];
  const queryFn = () =>
    userApi.getAllUsers({ search, sortBy, page, limit, role, accountStatus });

  return useQuery(queryKey, queryFn);
};

export const useUserById = (userId) => {
  return useQuery(
    [userQueryKeys.userById, userId],
    () => userApi.getUserById(userId),
    {
      enabled: !!userId, // This query will not execute until the userId is truthy
    }
  );
};

export const useGetAllUsersByRole = (role) => {
  return useQuery(
    [userQueryKeys.getAllUsersByRole, role],
    () => userApi.getAllUsersByRole(role),
    {
      enabled: !!role, // This query will not execute until the userId is truthy
    }
  );
};

export const useBusinessAccounts = (isSuperAdmin) => {
  return useQuery(
    [userQueryKeys.businessAccounts, isSuperAdmin],
    () => userApi.getBusinessAccounts()
    // {
    //   enabled: !!isSuperAdmin,
    // }
  );
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.createUser, {
    onSuccess: () => {
      // Invalidate and refetch all users to get the newly added user
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(farmQueryKeys.allUsersByFarmId);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.updateUser, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the user list is up-to-date
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(userQueryKeys.allUsersByFarmId);
      queryClient.invalidateQueries(farmQueryKeys.getCurrentFarmsOfContractor);
      queryClient.invalidateQueries(farmQueryKeys.getFarmsByBusinessAccounts);
      
    },
  });
};

export const useToggleUserAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.toggleUserAccountStatus, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the user list is up-to-date
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(userQueryKeys.allUsersByFarmId);
    },
  });
};

export const useToggleUserEmailVerification = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.toggleUserEmailVerification, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the user list is up-to-date
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(userQueryKeys.allUsersByFarmId);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.deleteUser, {
    onSuccess: () => {
      // Invalidate and refetch to reflect the deletion
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(userQueryKeys.allUsersByFarmId);
    },
  });
};

export const useDeleteBusinessAccountPermanantly = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.deleteBusinessAccountPermanantly, {
    onSuccess: () => {
      // Invalidate and refetch to reflect the deletion
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(userQueryKeys.allUsersByFarmId);
      queryClient.invalidateQueries(farmQueryKeys.allFarms);
    },
  });
};

export const useUpdateCoverImg = () => {
  const queryClient = useQueryClient();

  return useMutation(userApi.useUpdateCoverImg);
};

export const useUpdateUserById = () => {
  const queryClient = useQueryClient();
  return useMutation(userApi.useUpdateUserById, {
    onSuccess: () => {
      queryClient.invalidateQueries(userQueryKeys.allUsers);
      queryClient.invalidateQueries(userQueryKeys.allUsersByFarmId);
    },
  });
};

export const useResetPassword = () => {
  return useMutation(authApi.resetPassword);
};

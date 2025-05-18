import { cameraQueryKeys } from "hooks/hookIdentifiers";
import * as cameraApi from "api/cameraApi";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useGetAllCameras = ({
  search = "",
  sortBy = "createdAt_desc",
  page = 1,
  limit = 10,
}) => {
  const queryKey = [
    cameraQueryKeys.getAllCameras,
    { search, sortBy, page, limit },
  ];
  const queryFn = () =>
    cameraApi.getAllcameras({ search, sortBy, page, limit });

  return useQuery(queryKey, queryFn);
};

export const useCreateCamera = () => {
  const queryClient = useQueryClient();
  return useMutation(cameraApi.createCamera, {
    onSuccess: () => {
      queryClient.invalidateQueries(cameraQueryKeys.getAllCameras);
    },
  });
};

export const useDeleteCamera = () => {
  const queryClient = useQueryClient();
  return useMutation(cameraApi.deleteCamera, {
    onSuccess: () => {
      queryClient.invalidateQueries(cameraQueryKeys.getAllCameras);
    },
  });
};

export const useUpdateCamera = () => {
  const queryClient = useQueryClient();
  return useMutation(cameraApi.updateCamera, {
    onSuccess: () => {
      queryClient.invalidateQueries(cameraQueryKeys.getAllCameras);
    },
  });
};

export const useUniqueCameraId = () => {
  return useQuery(
    cameraQueryKeys.getUniqueCameraId,
    cameraApi.getUniqueCameraId
  );
};

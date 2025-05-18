import { trainingQueryKeys } from "hooks/hookIdentifiers";
import * as trainingApi from "api/trainingApi";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useGetAllTrainings = ({
  search = "",
  sortBy = "createdAt_desc",
  page = 1,
  limit = 2,
}) => {
  const queryKey = [
    trainingQueryKeys.getAllTrainings,
    { search, sortBy, page, limit },
  ];
  const queryFn = () =>
    trainingApi.getAllTrainings({ search, sortBy, page, limit });

  return useQuery(queryKey, queryFn);
};

export const useCreatetraining = () => {
  const queryClient = useQueryClient();
  return useMutation(trainingApi.createTraining, {
    onSuccess: () => {
      queryClient.invalidateQueries(trainingQueryKeys.getAllTrainings);
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();
  return useMutation(trainingApi.deleteTraining, {
    onSuccess: () => {
      queryClient.invalidateQueries(trainingQueryKeys.getAllTrainings);
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  return useMutation(trainingApi.updateTraining, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the user list is up-to-date
      queryClient.invalidateQueries(trainingQueryKeys.getAllTrainings);
    },
  });
};

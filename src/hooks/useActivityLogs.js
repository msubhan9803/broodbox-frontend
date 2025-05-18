import * as activityLogsApi from "api/activityLogsApi";
import { activityLogsQueryKeys } from "hooks/hookIdentifiers";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useActivityLogs = ({
  search = "",
  sortBy = "createdAt:desc",
  page = 1,
  limit = 10,
}) => {
  const queryKey = [
    activityLogsQueryKeys.getAllActivityLogs,
    { search, sortBy, page, limit },
  ];

  const queryFn = () =>
    activityLogsApi.getAllActivityLogs({ search, sortBy, page, limit });

  return useQuery(queryKey, queryFn);
};

export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  return useMutation(activityLogsApi.createActivityLog, {
    onSuccess: () => {
      // Invalidate and refetch all farms to get the newly added farm
      queryClient.invalidateQueries(activityLogsQueryKeys.getAllActivityLogs);
    },
  });
};

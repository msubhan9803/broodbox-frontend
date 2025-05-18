/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as farmManagementApi from "api/farmManagementApi";
import { farmQueryKeys } from "hooks/hookIdentifiers";
import axios from "axios";
import axiosInstance from "lib/axiosInstance";

export const useUniqueFarmId = () => {
  return useQuery(
    farmQueryKeys.uniqueFarmId,
    farmManagementApi.getUniqueFarmId
  );
};

export const useAllFarms = ({
  search = "",
  sortBy = "createdAt_desc",
  page = 1,
  limit = 10,
}) => {
  const queryKey = [farmQueryKeys.allFarms, { search, sortBy, page, limit }];
  const queryFn = () =>
    farmManagementApi.getAllFarms({ search, sortBy, page, limit });

  return useQuery(queryKey, queryFn);
};

export const useAllUsersByFarmId = ({
  farmId,
  search = "",
  sortBy = "createdAt_desc",
  page = 1,
  limit = 10,
}) => {
  const queryKey = [
    farmQueryKeys.allUsersByFarmId,
    { farmId, search, sortBy, page, limit },
  ];
  const queryFn = () =>
    farmManagementApi.getAllUsersByFarmId(farmId, {
      search,
      sortBy,
      page,
      limit,
    });

  return useQuery(queryKey, queryFn);
};

export const useAllBeeHiveByFarmId = ({
  farmId,
  businessAccRef,
  search = "",
  sortBy = "createdAt_desc",
  page = 1,
  limit = 10,
}) => {
  const queryKey = [
    farmQueryKeys.getAllBeeHiveLocations,
    { farmId, businessAccRef, search, sortBy, page, limit },
  ];
  const queryFn = () =>
    farmManagementApi.getAllBeeHiveByFarmId(farmId, businessAccRef, {
      search,
      sortBy,
      page,
      limit,
    });

  return useQuery(queryKey, queryFn);
};

export const useSingleBeeHiveByFarmId = ({
  farmId,
  businessAccRef,
  area_code,
  location_code,
}) => {
  const queryKey = [
    farmQueryKeys.getSingleBeeHiveLocation,
    { farmId, businessAccRef, area_code, location_code },
  ];
  const queryFn = () =>
    farmManagementApi.getSingleBeeHiveLocation({
      farmId,
      businessAccRef,
      area_code,
      location_code,
    });

  return useQuery(queryKey, queryFn);
};

export const useFarmsByBusinessAccountRef = (businessAccRef) => {
  return useQuery(
    [farmQueryKeys.farmsByBusinessAccountRef, businessAccRef],
    () => farmManagementApi.getFarmsByBusinessAccountRef(businessAccRef),
    {
      enabled: !!businessAccRef, // This query will not execute until the businessAccRef is truthy
    }
  );
};

export const useFarmById = (farmId) => {
  return useQuery(
    [farmQueryKeys.farmById, farmId],
    () => farmManagementApi.getFarmByFarmId(farmId),
    {
      enabled: !!farmId, // This query will not execute until the farmId is truthy
    }
  );
};

export const useTimeToGeneratePollinationMap = (farmId) => {
  return useQuery(
    [farmQueryKeys.timeToGeneratePollinationMap, farmId],
    () => farmManagementApi.getTimeToGeneratePollinationMap(farmId),
    {
      enabled: false,
    }
  );
};

export const useGeneratePollinationMap = (farmId) => {
  return useQuery(
    [farmQueryKeys.GeneratePollinationMap, farmId],
    () => farmManagementApi.getGeneratePollinationMap(farmId),
    {
      enabled: false,
    }
  );
};

export const useUpdateSpatialProbability = (farmId) => {
  return useQuery(
    [farmQueryKeys.GeneratePollinationMap, farmId],
    () => farmManagementApi.updateSpatialProbability(farmId),
    {
      enabled: false,
    }
  );
};

export const useGetPredictions = (farmId) => {
  return useQuery(
    [farmQueryKeys.GeneratePollinationMap, farmId],
    () => farmManagementApi.getPredictions(farmId),
    {
      enabled: false,
    }
  );
};

export const useGetLatestPollinationMapState = (farmId) => {
  return useQuery(
    [farmQueryKeys.GetInitialPollinationMap, farmId],
    () => farmManagementApi.getLatestPollinationMapState(farmId),
    {
      enabled: !!farmId,
    }
  );
};

export const usePollinationMapDateTime = (farmId) => {
  return useQuery([farmQueryKeys.GetPollinationMapDateTime, farmId], () =>
    farmManagementApi.getPollinationMapDateTime(farmId)
  );
};
// Get PollinationMap by date and time
export const useSpecificPollinationMapByDateTime = (params) => {
  // const queryClient = useQueryClient();
  return useMutation(farmManagementApi.getSpecificPollinationMapByDateTime, {
    onSuccess: () => {
      // queryClient.invalidateQueries(farmQueryKeys.allFarms);
    },
  });
};

export const useCurrentFarmRefOfUser = (userRef, businessAccountRef) => {
  return useQuery(
    [farmQueryKeys.farmById, userRef, businessAccountRef],
    () =>
      farmManagementApi.getCurrentFarmRefOfUser(userRef, businessAccountRef),
    {
      enabled: !!userRef && !!businessAccountRef,
    }
  );
};

export const useCanCreateMapCheck = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.canCreateMapCheck, {
    onSuccess: () => {
      // Invalidate and refetch all farms to get the newly added farm
      queryClient.invalidateQueries(farmQueryKeys.allFarms);
    },
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.createFarm, {
    onSuccess: () => {
      // Invalidate and refetch all farms to get the newly added farm
      queryClient.invalidateQueries(farmQueryKeys.allFarms);
    },
  });
};

export const useUpdateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.updateFarm, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the farm list is up-to-date
      queryClient.invalidateQueries(farmQueryKeys.allFarms);
    },
  });
};

export const useAddBeeHive = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.addBeeHive, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the farm list is up-to-date
      queryClient.invalidateQueries(farmQueryKeys.getAllBeeHiveLocations);
    },
  });
};
export const useUpdateHive = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.updateHive, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the farm list is up-to-date
      queryClient.invalidateQueries(farmQueryKeys.getAllBeeHiveLocations);
    },
  });
};

export const useDeleteBeeHiveLocation = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.deleteBeeHiveLocation, {
    onSuccess: () => {
      // Invalidate and refetch to ensure the farm list is up-to-date
      queryClient.invalidateQueries(farmQueryKeys.getAllBeeHiveLocations);
    },
  });
};

export const useDeleteFarm = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.deleteFarm, {
    onSuccess: () => {
      // Invalidate and refetch to reflect the deletion
      queryClient.invalidateQueries(farmQueryKeys.allFarms);
    },
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation(farmManagementApi.uploadFile, {
    onSuccess: () => {
      queryClient.invalidateQueries(farmQueryKeys.getSingleBeeHiveLocation);
    },
  });
};

export const useUploadMultipleFiles = () => {
  return useMutation(farmManagementApi.uploadMultipleFiles, {
    onSuccess: () => {
      // Invalidate relevant queries if necessary
      // queryClient.invalidateQueries(/* query key */);
    },
  });
};

export const useUploadMultipleFilesForHiveLocation = () => {
  return useMutation(farmManagementApi.addMultipleMediaForHiveLocation, {
    onSuccess: () => {
      // Invalidate relevant queries if necessary
      // queryClient.invalidateQueries(/* query key */);
    },
  });
};

export const useGetAllAreaLocationCodes = (params) => {
  return useQuery(["areaLocationCodes", params], () =>
    farmManagementApi.getAllAreaLocationCodes(params)
  );
};

export const useGetAllFramesByFarmId = (payload) => {
  return useQuery(
    [farmQueryKeys.getAllFramesByFarmId, payload.farmId],
    () => farmManagementApi.getAllFramesByFarmId(payload),
    {
      enabled: !!payload.farmId,
    }
  );
};
export const useGetAllAreaLocationActiveFrams = (payload) => {
  return useQuery(
    [farmQueryKeys.getAllAreaLocationActiveFrams, payload.farmId],
    () => farmManagementApi.getAllAreaLocationActiveFrams(payload),
    {
      enabled: !!payload.farmId,
    }
  );
};
export const useGetAllDataAsList = (payload) => {
  return useQuery(
    [farmQueryKeys.getAllDataAsList, payload.farmId],
    () => farmManagementApi.getAllDataAsList(payload),
    {
      enabled: !!payload.farmId,
    }
  );
};

export const useGetAllData = ({
  farmId,
  businessAccountRef,
  search = "",
  sortBy = "createdAt:desc",
  page = 1,
  limit = 10,
}) => {
  const queryKey = [
    "getAllData",
    { farmId, businessAccountRef, search, sortBy, page, limit },
  ];
  const queryFn = () =>
    axiosInstance
      .get(
        `/v1/farms/getAllData?farmId=${farmId}&businessAccountRef=${businessAccountRef}&search=${search}&sortBy=${sortBy}&page=${page}&limit=${limit}`
      )
      .then((res) => res.data);

  const { data, error, isLoading } = useQuery(queryKey, queryFn, {
    keepPreviousData: true,
  });

  return { data, error, isLoading };
};

export const useGetAllClassCountingData = (payload) => {
  return useQuery(
    [farmQueryKeys.getAllClassCountingData, payload.farmId],
    () => farmManagementApi.getAllClassCountingData(payload),
    {
      enabled: !!payload.farmId,
    }
  );
};

export const useSpecificClassCountingData = (payload) => {
  return useQuery(
    [farmQueryKeys.getAllClassCountingData, payload.farmId],
    () => farmManagementApi.getSpecificClassCountingData(payload),
    {
      enabled: !!payload.locationCode,
    }
  );
};

export const useGetFarmsByBusinessAccounts = (payload) => {
  return useQuery(
    [farmQueryKeys.getFarmsByBusinessAccounts, payload],
    () => farmManagementApi.getFarmsByBusinessAccounts(payload),
    {
      enabled: !!payload && payload.length > 0,
    }
  );
};

export const useGetCurrentFarmsOfContractor = (payload) => {
  return useQuery(
    [farmQueryKeys.getCurrentFarmsOfContractor, payload],
    () => farmManagementApi.getCurrentFarmsOfContractor(payload),
    {
      enabled: !!payload,
    }
  );
};

export const useDownloadBeehiveImages = () => {
  return useMutation(farmManagementApi.downloadBeehiveImages);
};

export const useGenerateAllPredictionsAndUpdateSpatialData = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.generateAllPredictionsAndUpdateSpatialData, {
    onSuccess: () => {
      // Invalidate and refetch all farms to get the newly added farm
      queryClient.invalidateQueries(farmQueryKeys.getAllBeeHiveLocations);
    },
  });
};

export const useGenerateFirstMap = () => {
  return useMutation(farmManagementApi.generateFirstMap);
};

export const useDidPredictionsRunOnce = (farmId) => {
  return useQuery(
    [farmQueryKeys.didPredictionsRunOnce, farmId],
    () => farmManagementApi.didPredictionsRunOnce(farmId),
    {
      enabled: !!farmId,
    }
  );
};

export const useGenerateSpecificSpatialUpdatesAndPredictionsGeneration = () => {
  const queryClient = useQueryClient();
  return useMutation(farmManagementApi.generateSpecificSpatialUpdatesAndPredictionsGeneration, {
    onSuccess: () => {
      // Invalidate and refetch all farms to get the newly added farm
      queryClient.invalidateQueries(farmQueryKeys.getAllBeeHiveLocations);
    },
  });
};
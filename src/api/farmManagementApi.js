import axios from "axios";
// import { debug } from "console";
import axiosInstance from "lib/axiosInstance";
import {
  getToken,
  generateParamsString,
  generateGenericQueryString,
} from "utils/helper";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getUniqueFarmId = async () => {
  const { data } = await axiosInstance.get(
    "/v1/farms/getUniqueFarmId",
    getAuthHeaders()
  );
  return data;
};

export const getAllFarms = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllFarms?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllUsersByFarmId = async (farmId, params) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllUsersByFarmId/${farmId}?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllBeeHiveByFarmId = async (farmId, businessAccRef, params) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllBeeHiveLocations/${businessAccRef}/${farmId}?${generateParamsString(
      params
    )}`,

    getAuthHeaders()
  );
  return data;
};

export const getSingleBeeHiveLocation = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getBeeHiveLocation?${generateGenericQueryString(params)}`,

    getAuthHeaders()
  );
  return data;
};

export const getFarmsByBusinessAccountRef = async (businessAccRef) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getFarmsByBusinessAccountRef/${businessAccRef}`,
    getAuthHeaders()
  );
  return data;
};

export const getFarmByFarmId = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getFarmByFarmId/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getTimeToGeneratePollinationMap = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getTimeToGeneratePollinationMap/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getGeneratePollinationMap = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/generatePollinationMap/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const updateSpatialProbability = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/updateSpatialProbability/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getPredictions = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getPredictions/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const generateFirstMap = async ({farmId}) => {
  debugger;
  const { data } = await axiosInstance.get(
    `/v1/farms/generateFirstMap/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getLatestPollinationMapState = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getLatestPollinationMapState/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const didPredictionsRunOnce = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/didPredictionsRunOnce/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getPollinationMapDateTime = async (farmId) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/generatePollinationMapWithDateTime/${farmId} `,
    getAuthHeaders()
  );
  return data;
};

export const getSpecificPollinationMapByDateTime = async (params) => {
  const { date, time, farmId } = params;

  const { data } = await axiosInstance.get(
    `/v1/farms/getSpecificPollinationMapByDateTime/${farmId}/${date}/${time}`,
    getAuthHeaders()
  );
  return data;
};

export const getCurrentFarmRefOfUser = async (userRef, businessAccountRef) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getCurrentFarmRefOfUser?${generateParamsString({
      userRef,
      businessAccountRef,
    })}`,
    getAuthHeaders()
  );
  return data;
};

export const canCreateMapCheck = async (payload) => {
  const { data } = await axiosInstance.post(
    `/v1/farms/canCreateMapCheck`,
    payload,
    getAuthHeaders()
  );
  return data;
};

export const createFarm = async (farmData) => {
  const { data } = await axiosInstance.post(
    "/v1/farms/createFarm",
    farmData,
    getAuthHeaders()
  );
  return data;
};

export const updateFarm = async (farmData) => {
  // Assuming farmId is part of farmData for updating
  const { farmId, ...updateData } = farmData;
  const { data } = await axiosInstance.put(
    `/v1/farms/updateFarm/${farmId}`,
    updateData,
    getAuthHeaders()
  );
  return data;
};
export const updateHive = async (params) => {
  // Assuming farmId is part of farmData for updating
  const {
    area_code,
    location_code,
    farmId,
    businessAccountRef,
    ...updateData
  } = params;

  const { data } = await axiosInstance.put(
    `/v1/farms/updateHive/${businessAccountRef}/${farmId}/${area_code}/${location_code}`,
    updateData,
    getAuthHeaders()
  );
  return data;
};

export const addBeeHive = async (farmData) => {
  // Assuming farmId is part of farmData for updating
  const { farmId, ...updateData } = farmData;
  const { data } = await axiosInstance.put(
    `/v1/farms/addBeeHive/${farmId}`,
    updateData,
    getAuthHeaders()
  );
  return data;
};

export const deleteFarm = async (farmId) => {
  const { data } = await axiosInstance.delete(
    `/v1/farms/deleteFarm/${farmId}`,
    getAuthHeaders()
  );
  return data;
};
export const deleteBeeHiveLocation = async (params) => {
  const { businessAccountRef, farmId, areaCode, locationCode } = params;
  const { data } = await axiosInstance.get(
    `/v1/farms/deleteBeeHiveLocation/${businessAccountRef}/${farmId}/${areaCode}/${locationCode}`,
    getAuthHeaders()
  );
  return data;
};

export const uploadFile = async (file) => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("file", file);
  // Make a POST request to the server
  const { data } = await axiosInstance.post("/v1/S3/addMedia", formData, {
    ...getAuthHeaders(),
    "Content-Type": "multipart/form-data",
  });
  return data;
};

export const uploadMultipleFiles = async (files) => {
  const formData = new FormData();

  // Append each file to the FormData object with its original filename
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const { data } = await axiosInstance.post(
      "/v1/S3/addMultipleMedia",
      formData,
      {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      }
    );
    return data;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const addMultipleMediaForHiveLocation = async ({
  params,
  selectedFiles,
}) => {
  const formData = new FormData();

  // Append each file to the FormData object with its original filename
  selectedFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const { data } = await axiosInstance.post(
      `/v1/S3/addMultipleMediaForHiveLocation?${generateParamsString(params)}`,
      formData,
      {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      }
    );
    return data;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const getAllAreaLocationCodes = async (params) => {
  const { farmId, businessAccRef } = params;
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllAreaLocationCodes/${businessAccRef}/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllFramesByFarmId = async (payload) => {
  const { farmId, businessAccountRef } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllFramesByFarmId/${businessAccountRef}/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllAreaLocationActiveFrams = async (payload) => {
  const { farmId, businessAccountRef } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllAreaLocationActiveFrams/${businessAccountRef}/${farmId}`,
    getAuthHeaders()
  );
  return data;
};
export const getAllDataAsList = async (payload) => {
  const { farmId, businessAccountRef } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllDataAsList/${businessAccountRef}/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllData = async (params) => {
  const { farmId, businessAccountRef } = params;
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllData/${businessAccountRef}/${farmId}?${generateParamsString(
      params
    )}`,
    getAuthHeaders()
  );
  return data;
};

export const getAllClassCountingData = async (payload) => {
  const { farmId, businessAccountRef } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/getAllClassCountingData/${businessAccountRef}/${farmId}`,
    getAuthHeaders()
  );
  return data;
};
export const getSpecificClassCountingData = async (payload) => {
  const { farmId, businessAccountRef, areaCode, locationCode } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/getSpecificClassCountingData/${businessAccountRef}/${farmId}/${areaCode}/${locationCode}`,
    getAuthHeaders()
  );
  return data;
};

export const getSpecificPredictions = async (params) => {
  const { data } = await axiosInstance.get(
    `/v1/farms/getSpecificPredictions?${generateParamsString(params)}`,
    getAuthHeaders()
  );
  return data;
};

export const getFarmsByBusinessAccounts = async (businessesAccounts) => {
  if (
    !Array.isArray(businessesAccounts) ||
    businessesAccounts.length === 0 ||
    businessesAccounts === undefined
  ) {
    return;
  }

  const { data } = await axiosInstance.post(
    `/v1/farms/getFarmsByBusinessAccounts`,
    {
      businessesAccounts: businessesAccounts.map((elem) => elem.value),
    },
    getAuthHeaders()
  );
  return data;
};

export const getCurrentFarmsOfContractor = async (payload) => {
  const { userRef, businessAccountRef } = payload;

  if (!Array.isArray(businessAccountRef) || businessAccountRef === undefined) {
    return;
  }

  if (userRef === undefined) {
    return;
  }

  const { data } = await axiosInstance.post(
    `/v1/farms/getCurrentFarmsOfContractor`,
    payload,
    getAuthHeaders()
  );

  return data;
};

export const downloadBeehiveImages = async (payload) => {
  const { farmId, businessAccRef, area_code, location_code } = payload;

  // const resp = await axiosInstance.get(
  //   `/v1/farms/downloadBeehiveImages/${farmId}/${businessAccRef}/${area_code}/${location_code}`,
  //   getAuthHeaders()
  // );

  const resp = await fetch(
    `${process.env.REACT_APP_BASE_URL}/v1/farms/downloadBeehiveImages/${farmId}/${businessAccRef}/${area_code}/${location_code}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return resp;
};

export const generateAllPredictionsAndUpdateSpatialData = async (payload) => {
  const { farmId } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/generateAllPredictionsAndUpdateSpatialData/${farmId}`,
    getAuthHeaders()
  );
  return data;
};

export const generateSpecificSpatialUpdatesAndPredictionsGeneration = async (
  payload
) => {
  const { farmId, businessAccRef, areaCode, locationCode } = payload;
  const { data } = await axiosInstance.get(
    `/v1/farms/generateSpecificSpatialUpdatesAndPredictionsGeneration/${farmId}/${businessAccRef}/${areaCode}/${locationCode}`,
    getAuthHeaders()
  );
  return data;
};

import axiosInstance from "lib/axiosInstance";
import { generateParamsString } from "utils/helper";

export const getMyIPInfo = async () => {
  const { data } = await axiosInstance.get(
    `https://api.ipgeolocation.io/ipgeo?${generateParamsString({
      apiKey: process.env.REACT_APP_GEO_LOCATION_API_KEY,
    })}`
  );
  return data;
};

export const userQueryKeys = {
  allUsers: "allUsers",
  userById: "userById",
  businessAccounts: "businessAccounts",
  getAllUsersByRole: 'getAllUsersByRole'
};

export const activityLogsQueryKeys = {
  getAllActivityLogs: "getAllActivityLogs",
  createActivityLog: "createActivityLog",
};
export const farmQueryKeys = {
  uniqueFarmId: "uniqueFarmId",
  allFarms: "allFarms",
  allUsersByFarmId: "allUsersByFarmId",
  farmsByBusinessAccountRef: "farmsByBusinessAccountRef",
  deleteBeeHiveLocationById: "deleteBeeHiveLocationById",
  farmById: "farmById",
  didPredictionsRunOnce: "didPredictionsRunOnce",
  addBeeHive: "addBeeHive",
  getAllBeeHiveLocations: "getAllBeeHiveLocations",
  getSingleBeeHiveLocation: "getSingleBeeHiveLocation",
  timeToGeneratePollinationMap: "timeToGeneratePollinationMap",
  GeneratePollinationMap: "GeneratePollinationMap",
  GetInitialPollinationMap: "getInitialPollinationMap",
  GetPollinationMapDateTime: "getPollinationMapDateTime",
  getAllFramesByFarmId: "getAllFramesByFarmId",
  getAllAreaLocationActiveFrams: "getAllAreaLocationActiveFrams",
  getAllDataAsList: "getAllDataAsList",
  getAllData: "getAllData",
  getAllClassCountingData: "getAllClassCountingData",
  getSpecificClassCountingData: "getSpecificClassCountingData",
  getFarmsByBusinessAccounts: 'getFarmsByBusinessAccounts',
  getCurrentFarmsOfContractor: 'getCurrentFarmsOfContractor'
};

export const userManagementQueryKeys = {
  modules: "modules",
  roles: "roles",
  privileges: "privileges",
  privilegesByRoleNameWithoutPopulation:
    "privilegesByRoleNameWithoutPopulation",
};

export const trainingQueryKeys = {
  getAllTrainings: "getAllTrainings",
};
export const cameraQueryKeys = {
  getAllCameras: "getAllCameras",
  getUniqueCameraId: "getUniqueCameraId",
};

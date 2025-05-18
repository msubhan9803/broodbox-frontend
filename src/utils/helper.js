export const getBasePath = (pathname) => {
  const pathSegments = pathname.split("/");
  return pathSegments[1];
};

export const getChildPath = (pathname) => {
  const pathSegments = pathname.split("/");
  return pathSegments[2];
};

export const getToken = () =>
  JSON.parse(localStorage.getItem("user")).tokens.access.token;

export const checkTokenExistence = () =>
  !!localStorage.getItem("user")

export const removeEmptyFields = (obj) => {
  const cleanedObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      cleanedObj[key] = obj[key];
    }
  });
  return cleanedObj;
};

export const generateQueryString = (farmId) => {
  const queryString = new URLSearchParams({
    farmId,
  }).toString();
  return queryString;
};

export const generateGenericQueryString = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString;
};

export const generateParamsString = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => value && `${key}=${value}`)
    .filter(Boolean)
    .join("&");

export const removeIds = (obj) => {
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      removeIds(item);
    });
  } else if (typeof obj === "object" && obj !== null) {
    delete obj._id;

    Object.values(obj).forEach((value) => {
      removeIds(value);
    });
  }
};

export const checkModulePrivilege = (moduleName, state) => {
  return state.some((module) => module.moduleRef.name === moduleName);
};

export const checkScreenPrivilege = (moduleName, screenName, state) => {
  const module = state.find((module) => module.moduleRef.name === moduleName);
  return module
    ? module.screenList.some((screen) => screen.screenRef.name === screenName)
    : false;
};

export const convertStringToArray = (urlString) => {
  // If the string is empty or contains only square brackets, return an empty array
  if (!urlString || urlString === "[]" || urlString.trim() === "") {
    return [];
  }

  // Remove square brackets and split the string into an array
  let urlArray = urlString.substring(1, urlString.length - 1).split(",");

  // Trim extra spaces
  urlArray = urlArray.map((url) => url.trim());

  return urlArray;
};

export const convertArrayToString = (urlArray) => {
  // Join array elements into a string separated by commas
  let urlString = urlArray.join(", ");

  // Add square brackets to the beginning and end of the string
  urlString = `[${urlString}]`;

  return urlString;
};
export const checkActionPrivilege = (
  moduleName,
  screenName,
  actionName,
  state
) => {
  const module = state.find((module) => module.moduleRef.name === moduleName);
  if (!module) return false;

  const screen = module.screenList.find(
    (screen) => screen.screenRef.name === screenName
  );
  return screen
    ? screen.actionList.some(
        (action) => action.actionRef.actionId === actionName
      )
    : false;
};

export const checkPermission = (actionName, screenName, moduleName, state) => {
  if (actionName && screenName && moduleName) {
    return checkActionPrivilege(moduleName, screenName, actionName, state);
  } else if (screenName && moduleName) {
    return checkScreenPrivilege(moduleName, screenName, state);
  } else if (moduleName) {
    return checkModulePrivilege(moduleName, state);
  } else {
    return false;
  }
};

export const getResultImageUrl = (businessAccountRef, farmId, areaCode, location_code, imageName) => {
  return `${process.env.REACT_APP_BASE_URL}/v1/S3/getChildMedia/images_${businessAccountRef}/results_${farmId}/${areaCode}/${location_code}/${imageName}`;
};
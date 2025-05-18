import axiosInstance from "lib/axiosInstance";

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const register = async (userData) => {
  const { data } = await axiosInstance.post("/v1/auth/register", userData);
  return data;
};

export const login = async (loginData) => {
  const { data } = await axiosInstance.post("/v1/auth/login", loginData);
  return data;
};

export const logout = async (refreshToken) => {
  const { data } = await axiosInstance.post(
    "/v1/auth/logout",
    { refreshToken },
    getAuthHeaders()
  );
  return data;
};

export const refreshTokens = async (refreshToken) => {
  const { data } = await axiosInstance.post("/v1/auth/refresh-tokens", {
    refreshToken,
  });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post("/v1/auth/forgot-password-token", {
    email,
  });
  return data;
};
export const resetPasswordToken = async (email) => {
  const { data } = await axiosInstance.post(
    `/v1/auth/reset-password-token?email=${email}`
  );
  return data;
};

export const resetPassword = async (body) => {
  const { data } = await axiosInstance.post(
    "/v1/auth/reset-password",
    body,
    getAuthHeaders()
  );
  return data;
};

export const sendVerificationEmail = async (email) => {
  const { data } = await axiosInstance.post(
    `/v1/auth/resend-verification-email/${email}`
  );
  return data;
};

// export const verifyEmail = async (token) => {
//   const { data } = await axiosInstance.post("/v1/auth/verify-email", { token });
//   return data;
// };

export const verifyEmail = async (token) => {
  const { data } = await axiosInstance.post(
    `/v1/auth/verify-email?token=${token}`
  );
  return data;
};

export const setPassword = async (params) => {
  const { token, ...body } = params;
  const { data } = await axiosInstance.post(
    `/v1/auth/set-password?token=${token}`,
    body
  );
  return data;
};

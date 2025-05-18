import { useMutation } from "react-query";
import * as authService from "api/authApi";

export const useRegister = () => {
  return useMutation(authService.register);
};

export const useLogin = () => {
  return useMutation(authService.login);
};

export const useLogout = () => {
  return useMutation(authService.logout);
};

export const useRefreshTokens = () => {
  return useMutation(authService.refreshTokens);
};

export const useForgotPassword = () => {
  return useMutation(authService.forgotPassword);
};

export const useResetPassword = () => {
  return useMutation(authService.resetPassword);
};

export const useSendVerificationEmail = () => {
  return useMutation(authService.sendVerificationEmail);
};

export const useVerifyEmail = (token) => {
  return useMutation(authService.verifyEmail);
};
export const useResetPasswordToken = () => {
  return useMutation(authService.resetPasswordToken);
};
export const useSetPassword = () => {
  return useMutation(authService.setPassword);
};

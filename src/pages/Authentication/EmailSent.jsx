import Logo from "assets/icons/Logo";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { useResetPasswordToken } from "hooks/useAuth";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const EmailSent = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState(emailParam || "");
  const useResetPasswordTokenMutation = useResetPasswordToken();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      return; // No need for error handling
    }
    useResetPasswordTokenMutation.mutate(email, {
      onSuccess: (data) => {
        toast.success("Successfully sent reset password email");
      },
      onError: () => {
        toast.error("An error occurred. Please try again later");
      },
    });
  };

  return (
    <div className="flex items-center justify-center mt-[5%]">
      <div className="flex flex-col items-center justify-center">
        <Logo /> {/* Adjust margin-bottom for Logo */}
        <h1 className="text-[#1B2559] text-3xl font-bold">Broodbox</h1>
        <h1
          className="text-3xl font-bold mt-4 "
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          Email has been sent
        </h1>
        <span
          style={{ fontFamily: "Open Sans, sans-serif" }}
          className="text-[14px] text-[#333333] mt-2 text-center mx-[22%]"
        >
          Click on the verification link sent to your email so we can reset your
          password
        </span>
        <div style={{ marginTop: "50px" }}>
          <span className="font-normal ">Didn't receive an Email yet? </span>{" "}
          <span
            onClick={handleSubmit}
            className="text-[#4f8ff9] font-bold cursor-pointer"
          >
            Resend email
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;

import Logo from "assets/icons/Logo";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { useResetPasswordToken } from "hooks/useAuth";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const useResetPasswordTokenMutation = useResetPasswordToken();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    }
    useResetPasswordTokenMutation.mutate(email, {
      onSuccess: (data) => {
        toast.success("Successfully sent reset password email");
        history.push(`/email-sent?email=${email}`);
      },
      onError: () => {
        toast.error("An error occurred. Please try again later");
      },
    });
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
          Let’s reset your Password
        </h1>
        <span
          style={{ fontFamily: "Open Sans, sans-serif" }}
          className="text-[14px] text-[#333333] mt-2 text-center "
        >
          Enter your Email so we can reset your password
        </span>
        <div className="mt-10">
          {" "}
          {/* Wrap input and button in separate div */}
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleChange}
            className="w-[360px] border-b border-gray-300 py-4 focus:outline-none"
          />
          {error && <div className="text-red-600">{error}</div>}
        </div>
        <div className="mt-10">
          {" "}
          {/* Wrap input and button in separate div */}
          <button
            type="button"
            className="bg-primary-main text-white font-bold w-[360px] h-[46px] rounded-lg"
            onClick={handleSubmit}
          >
            {useResetPasswordTokenMutation.isLoading ? (
              <ButtonSpinner />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { RxCheckCircled } from "react-icons/rx";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useSendVerificationEmail, useVerifyEmail } from "hooks/useAuth";
import { toast } from "react-toastify";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const VerificationSuccess = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const useVerifyEmailMutation = useVerifyEmail();
  const useSendVerificationEmailMutation = useSendVerificationEmail();

  const handleResendEmail = () => {
    useSendVerificationEmailMutation.mutate(email, {
      onSuccess: (data) => {
        toast.success("Successfully Resend Email");
      },
      onError: () => {
        toast.error("An error occurred. Please try again later");
      },
    });
  };

  const handleSubmit = () => {
    useVerifyEmailMutation.mutate(token, {
      onSuccess: (data) => {
        toast.success("Successfully verified your email");
        history.push(`/tos?token=${data.setPasswordToken}`);
      },
      onError: () => {
        toast.error("An error occurred. Please try again later");
        history.push(`/verification-failed?email=${email}`);
      },
    });
  };
  return (
    <div className="flex items-center justify-center mt-[10%] ">
      <div className="items-center ">
        <RxCheckCircled className="text-primary-main  w-full h-24" />
        <div className="text-center  text-3xl font-medium mt-10">
          Email verification successful
        </div>
        <div className="text-center text-[18px] font-bold">
          Continue to setup your account
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary-main  text-white w-[360px] h-[46px] mt-24  rounded-lg flex justify-center items-center font-bold"
          >
            {useVerifyEmailMutation.isLoading ? <ButtonSpinner /> : "Continue"}
          </button>
        </div>
        {/* <div
          onClick={handleResendEmail}
          className="flex cursor-pointer items-center font-bold mt-12 justify-center text-[#205BF5] text-xs"
        >
          Resend Email
        </div> */}
      </div>
    </div>
  );
};

export default VerificationSuccess;

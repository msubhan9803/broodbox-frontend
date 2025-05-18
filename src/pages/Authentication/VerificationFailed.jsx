import { RxCrossCircled } from "react-icons/rx";
import { useSendVerificationEmail } from "hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const VerificationFailed = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const useSendVerificationEmailMutation = useSendVerificationEmail();

  const handleSubmit = () => {
    useSendVerificationEmailMutation.mutate(email, {
      onSuccess: (data) => {
        toast.success("Successfully Resend Email");
      },
      onError: () => {
        toast.error("An error occurred. Please try again later");
      },
    });
  };
  return (
    <div className="flex items-center justify-center mt-[10%] ">
      <div className="items-center ">
        <RxCrossCircled className="text-red-500  w-full h-24" />
        <div className="text-center  text-3xl font-medium mt-10">
          Email verification failed
        </div>
        <div className="text-center text-[18px] font-bold">
          Verification link expired
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary-main text-white w-[360px] h-[46px] mt-24  rounded-lg flex justify-center items-center font-bold"
          >
            {useSendVerificationEmailMutation.isLoading ? (
              <ButtonSpinner />
            ) : (
              "Resend Verification Email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationFailed;

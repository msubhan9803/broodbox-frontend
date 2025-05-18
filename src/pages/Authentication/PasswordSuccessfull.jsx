import Logo from "assets/icons/Logo";
import { RxCheckCircled } from "react-icons/rx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const PasswordSuccessfull = () => {
  const history = useHistory();
  return (
    <div className="flex items-center justify-center mt-[5%]">
      <div className="flex flex-col items-center justify-center">
        <Logo /> {/* Adjust margin-bottom for Logo */}
        <h1 className="text-[#1B2559] text-3xl font-bold">Broodbox</h1>
        <div className="py-20">
          <RxCheckCircled className="text-primary-main  w-full h-24" />
        </div>
        <h1
          className="text-3xl font-bold mt-4"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          Password has been reset successfully
        </h1>
        <span className="text-[18px] text-[#333333] mt-2">
          You can now login with your new password
        </span>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => history.push("./")}
            className="bg-primary-main text-white w-[360px] h-[46px] mt-24  rounded-lg flex justify-center items-center font-bold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSuccessfull;

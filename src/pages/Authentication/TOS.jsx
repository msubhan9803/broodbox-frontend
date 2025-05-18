import { IoChevronBackOutline } from "react-icons/io5";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
const TOS = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  return (
    <div className="flex-col justify-center  pt-8">
      <div className=" justify-center px-[30%]">
        <h1 className="font-bold text-3xl mb-6">Terms and Conditions</h1>
        <p style={{ lineHeight: "1.7" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <p className="mt-4" style={{ lineHeight: "1.7" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.orem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.orem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type
        </p>
      </div>
      <div className="flex w-full  py-4 justify-end pr-[10%] space-x-8">
        <button
          type="button"
          onClick={() => history.goBack()}
          className="flex items-center text-[#909FBA]"
        >
          <IoChevronBackOutline /> Back
        </button>
        <button
          type="button"
          onClick={() => history.push("/create-password?token=" + token)}
          className="bg-primary-main text-white w-[160px] h-[46px]   rounded-lg   font-bold"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TOS;

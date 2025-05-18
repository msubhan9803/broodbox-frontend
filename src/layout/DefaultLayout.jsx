/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { HiOutlineXMark } from "react-icons/hi2";
import { signIn } from "../redux/Slices/UserSlice";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import { useUserById, useUpdateUserById } from "hooks/useUser";
import { checkModulePrivilege, getBasePath } from "utils/helper";
import { getMyIPInfo } from "api/generaApi";
import ExpandableNotification from "components/common/Modals/ExpandableNotification";

// function ExpandableNotification() {
//   const toastId = "temp-id";
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleOpen = () => setIsOpen(!isOpen);
//   const dismiss = () => toast.dismiss(toastId);

//   return (
//     <div className="flex flex-col items-center justify-start relative overflow-hidden">
//       <div
//         className="bg-blue-100 w-full rounded flex justify-between items-center cursor-pointer h-16 p-2"
//         onClick={toggleOpen}
//       >
//         <div className="flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-blue-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
//             />
//           </svg>
//           <h4 className="font-medium text-sm text-blue-500">
//             Add bitcoin to your wallet
//           </h4>
//         </div>
//         <div className="flex gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className={`h-4 w-4 transition-transform ${
//               isOpen ? "rotate-180" : ""
//             }`} // Rotate icon when open
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>

//           <HiOutlineXMark className="h-4 w-4" onClick={dismiss} />
//         </div>
//       </div>
//       {isOpen && (
//         <div className="w-full bg-white p-4 transition ease-out duration-300">
//           <h4 className="text-sm text-slate-400">
//             Now you can earn bitcoin in your wallet just by referring coinx to
//             one of your friends.
//           </h4>
//           <button className="bg-blue-500 p-2 text-sm text-white font-bold rounded mt-4">
//             Refer now
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

const DefaultLayout = ({ children }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const basePath = getBasePath(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [userTimezone, setUserTimezone] = useState("");
  const { data: privilegedModulesData, isLoading: privilegedModulesLoading } =
    useGetPrivilegesByRoleName(user?.user?.role);
  const { data: userByIdData, isLoading: userByIdLoading } = useUserById(
    user?.user?._id
  );
  const useUpdateUserByIdMutation = useUpdateUserById();
  const fetchedPollinationAvailable = useSelector(
    (state) => state.pollinationMap.fetchedPollinationAvailable
  );

  const handleTimeZoneUpdate = async (value) => {
    let timezoneVal = "";
    if (value) {
      timezoneVal = value;
    } else {
      const { time_zone } = await getMyIPInfo();
      timezoneVal = time_zone.name;
    }

    useUpdateUserByIdMutation.mutate({
      timezone: timezoneVal,
    });
  };

  useLayoutEffect(() => {
    const auth = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);

      if (user === null) {
        history.push("/auth/signin");
      } else {
        dispatch(signIn(user));
      }
    };

    auth();
  }, [dispatch]);

  useEffect(() => {
    if (privilegedModulesData) {
      const checkPermissionVal = checkModulePrivilege(
        basePath,
        privilegedModulesData?.moduleList
      );
      if (!checkPermissionVal) {
        history.push("/not_authorized");
      }
    }
  }, [privilegedModulesData, basePath, history]);

  useEffect(() => {
    if (!userByIdData) return;

    if (!userByIdData.timezone) {
      handleTimeZoneUpdate();
    } else {
      setUserTimezone(userByIdData.timezone);
    }
  }, [userByIdData]);

  useEffect(() => {
    if (userTimezone) {
      handleTimeZoneUpdate(userTimezone);
    }
  }, [userTimezone]);

  useEffect(() => {
    if (fetchedPollinationAvailable) {
      console.log(
        "🗺️🗺️🗺️🗺️ fetchedPollinationAvailable: ",
        fetchedPollinationAvailable
      );

      if (!window.location.pathname.includes("map_detail")) {
        toast(<ExpandableNotification farmId={fetchedPollinationAvailable} />, {
          toastId: fetchedPollinationAvailable,
          closeOnClick: false,
          autoClose: false,
          style: {
            margin: "0px",
            padding: "0px",
            display: "flex",
            alignItems: "flex-start",
          },
          closeButton: false,
          bodyClassName: "p-0",
        });
      }
    }
  }, [fetchedPollinationAvailable]);

  return (
    <div className="dark:bg-boxdark-2 bg-[#F4F7FE] relative">
      <div className="flex h-screen overflow-y-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          moduleList={privilegedModulesData?.moduleList}
          loading={privilegedModulesLoading}
        />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userTimezone={userTimezone}
            setUserTimezone={setUserTimezone}
          />

          <main className="grow">
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;

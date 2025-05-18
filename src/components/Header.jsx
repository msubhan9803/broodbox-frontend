import { Link } from "react-router-dom";
import { HiBars3 } from "react-icons/hi2";
import Logo from "images/logo/logo.svg";
import ComboBox from "components/common/controls/ComboBox";
// import DarkModeSwitcher from "components/DarkModeSwitcher";
// import DropdownMessage from "components/DropdownMessage";
import DropdownNotification from "components/DropdownNotification";
import DropdownUser from "components/DropdownUser";
import { timezoneList } from "utils/timezoneList";

const Header = (props) => {
  const { userTimezone, setUserTimezone } = props;

  return (
    <header className="top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden mr-1">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <HiBars3 />
          </button>

          {/* <Link
            className="block flex-shrink-0 w-[80px] h-auto lg:hidden"
            to="/"
          >
            <img src={Logo} alt="Logo" />
          </Link> */}
        </div>

        <div className="flex items-center lg:justify-end lg:w-full gap-1 lg:gap-3">
          <ul className="flex items-center gap-2 2xsm:gap-4 selector2">
            {/* <DarkModeSwitcher /> */}

            <ComboBox
              onChange={(elem) => {
                setUserTimezone(elem)
              }}
              value={userTimezone}
              placeholder="Timezone"
              options={
                timezoneList?.map((tz) => ({
                  value: tz,
                  label: tz,
                })) || []
              }
            />

            {/* <DropdownNotification /> */}

            {/* <DropdownMessage /> */}
          </ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;

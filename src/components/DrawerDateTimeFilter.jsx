import React from "react";
import { RxCross2 } from "react-icons/rx";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const DrawerDateTimeFilter = ({
  isOpen,
  handleClose,
  title,
  children,
  loading,
}) => {
  const isMobileOrTablet = window.innerWidth < 768;

  const drawerSize = isMobileOrTablet ? "100%" : "620px"; // Corrected size typo

  return (
    <Drawer
      open={isOpen}
      onClose={!loading ? handleClose : undefined} // More explicit handling
      direction="right"
      size={drawerSize}
      zIndex={9999}
      className="flex flex-col h-full md:rounded-l-xl"
      disableOverlayClick={loading}
      lockBackgroundScroll
    >
      <div className="flex justify-between items-center px-6 py-4 shadow-3 border-b-gray-200">
        <h1 className="text-2xl font-bold">{title}</h1>
        <RxCross2
          className="cursor-pointer"
          onClick={!loading ? handleClose : undefined} // More explicit handling
        />
      </div>

      <div className="flex-grow overflow-y-auto px-6 py-6">{children}</div>
    </Drawer>
  );
};

export default DrawerDateTimeFilter;

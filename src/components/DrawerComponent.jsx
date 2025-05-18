import React from "react";
import { RxCross2 } from "react-icons/rx";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const DrawerComponent = ({ isOpen, handleClose, title, children, loading }) => {
  const isMobileOrTablet = window.innerWidth < 768;

  const drawerStyle = {
    zIndex: 9999,
    ...(isMobileOrTablet
      ? { size: "100%" }
      : {
          size: "460px",
        }),
  };

  return (
    <Drawer
      open={isOpen}
      onClose={loading ? () => {} : handleClose}
      direction="right"
      size={drawerStyle.size}
      zIndex={drawerStyle.zIndex}
      className="flex flex-col h-full md:rounded-l-xl"
      disableOverlayClick={loading}
      lockBackgroundScroll
    >
      <div className="flex justify-between items-center px-6 py-4 shadow-3 border-b-gray-200">
        <h1 className="text-2xl font-bold">{title}</h1>
        <RxCross2
          className="cursor-pointer"
          onClick={loading ? () => {} : handleClose}
        />
      </div>

      <div className="flex-grow overflow-y-auto px-6 py-6">{children}</div>

      <div className="bg-white p-4 flex justify-end border shadow-3 border-t-gray-200 md:rounded-bl-xl">
        <button
          type="button"
          onClick={handleClose}
          className="text-slate-500 w-[153px] h-[46px] rounded-lg mr-4"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary-main disabled:bg-primary-light text-white w-[153px] h-[46px] rounded-lg flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <ButtonSpinner /> : "Save"}
        </button>
      </div>
    </Drawer>
  );
};

export default DrawerComponent;

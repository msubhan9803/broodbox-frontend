import React, { useEffect, useState } from "react";
import Switch from "components/common/controls/Switch";

export default function AllowdModuleCheck({
  moduleRef,
  existingModuleList,
  handleOnChange,
  checkModuleExistence,
}) {
  const [isChecked, setIsChecked] = useState(false);

  const _handleOnChange = () => {
    handleOnChange(moduleRef);
  };

  useEffect(() => {
    const isExisting = checkModuleExistence(moduleRef);

    setIsChecked(isExisting);
  }, [existingModuleList, moduleRef]);

  return (
    <div className="py-3 px-4 flex justify-between w-full border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none">
      <span className="text-md font-bold">Is Module Allowd?</span>
      <Switch checked={isChecked} onChange={_handleOnChange} id="role_switch" />
    </div>
  );
}

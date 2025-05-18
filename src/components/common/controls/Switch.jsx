import React from "react";

const Switch = ({ checked, onChange, disabled, id = "switch", ...props }) => {
  return (
    <label
      htmlFor={id}
      className="inline-flex relative items-center cursor-pointer"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />
      <div className="w-[2.55rem] h-6 bg-gray-100 rounded-full peer-focus:ring-primary-main dark:bg-gray-800 peer-checked:bg-primary-dark transition-colors ease-in-out duration-200 outline-none"></div>
      <span className="absolute left-1 top-1 bg-white dark:bg-gray-400 w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-full"></span>
    </label>
  );
};

export default Switch;

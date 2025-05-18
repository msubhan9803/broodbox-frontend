import React from "react";

function ToggleSwitch({ active, setActive, label1, label2 }) {
  return (
    <div className="flex w-full rounded-lg overflow-hidden ">
      <button
        className={`text-center transition-colors duration-300  h-[40px] px-3
        gap-[5px]
         ${
           active === label1.toLowerCase()
             ? "bg-primary-main text-white"
             : "bg-white text-primary-main"
         }`}
        onClick={() => setActive(label1.toLowerCase())}
      >
        {label1}
      </button>

      <button
        className={`text-center  transition-colors duration-300  h-[40px] px-3
        gap-[5px]
         ${
           active === label2.toLowerCase()
             ? "bg-primary-main text-white"
             : "bg-white text-primary-main"
         }`}
        onClick={() => setActive(label2.toLowerCase())}
      >
        {label2}
      </button>
    </div>
  );
}

export default ToggleSwitch;

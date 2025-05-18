import React from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

const PhoneNumberInputComponent = ({ onChange, onBlur, value, error, disabled }) => {
  const handleChange = (value, country, e, formattedValue) => {
    onChange(value);
  };

  return (
    <div className="relative">
      <PhoneInput
        country={"us"}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        containerClass="w-full"
        inputClass={`!w-full !border !py-[22px] px-4 !rounded-lg ${
          error ? "!border-red-500" : "!border-gray-200"
        }`}
        buttonClass={`absolute top-0 bottom-0 left-0 bg-none text-gray-600 outline-none !rounded-l-lg !bg-transparent ${
          error ? "!border-red-500" : "!border-gray-200"
        }`}
        disabled={disabled}
      />
      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default PhoneNumberInputComponent;

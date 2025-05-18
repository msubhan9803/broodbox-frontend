import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enUS from "date-fns/locale/en-US";
registerLocale("en-US", enUS);

const CustomDatePicker = ({
  error,
  placeholder,
  disabled,
  value,
  onChange,
}) => {
  const formatDate = (date) => {
    return date
      ? new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date(date))
      : "";
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      disabled={disabled}
      className={`w-full relative py-3 px-4 cursor-default rounded-lg text-sm text-left focus:outline-none focus-visible:ring-2 disabled:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 border ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    >
      <span
        className={`block truncate ${
          !value ? "text-gray-500" : "text-current"
        }`}
      >
        {value ? formatDate(value) : placeholder}
      </span>
    </button>
  ));

  return (
    <div className="relative mt-1 z-20 w-full bg-white rounded-lg">
      <DatePicker
        selected={value}
        onChange={onChange}
        customInput={<CustomInput />}
        dateFormat="MMMM d, yyyy"
        locale="en-US"
        disabledKeyboardNavigation
        disabled={disabled}
        wrapperClassName="w-full z-50"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default CustomDatePicker;

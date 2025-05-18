import React, { useState, forwardRef } from "react";
import {
  MdOutlineErrorOutline,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { inputTypes } from "utils/constants";

const Input = forwardRef(
  ({ type, value, onChange, placeholder, error, name, disabled }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const inputType =
      type === inputTypes.password && isPasswordVisible ? "text" : type;

    return (
      <div>
        <div className="relative">
          <input
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            name={name}
            ref={ref}
            className={`py-3 px-4 block w-full border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none ${
              error?.message ? "border-red-500" : "border-gray-200"
            }`}
            disabled={disabled}
          />
          {type === inputTypes.password && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 end-0 flex items-center pe-3"
            >
              {isPasswordVisible ? (
                <MdVisibilityOff className={`${error?.message ? 'text-red-500' : "text-gray-700"}`} />
              ) : (
                <MdVisibility className={`${error?.message ? 'text-red-500' : "text-gray-700"}`} />
              )}
            </button>
          )}
          {type !== inputTypes.password && error?.message && (
            <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
              <MdOutlineErrorOutline className="text-red-500 mr-2" />
            </div>
          )}
        </div>
        {error?.message && (
          <p
            className="text-sm text-red-600 mt-2"
            id="hs-validation-name-error-helper"
          >
            {error?.message}
          </p>
        )}
      </div>
    );
  }
);

export default Input;

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { MdOutlineErrorOutline } from "react-icons/md";

const Select = ({ options, value, onChange, placeholder, error, disabled }) => {
  const selectedOption = options.find((option) => option.value === value) || {};

  return (
    <>
      <Listbox
        value={selectedOption}
        onChange={(option) => onChange(option.value)}
        disabled={disabled}
      >
        <div className="relative z-10 min-w-52 w-full md:w-auto bg-white rounded-lg">
          <Listbox.Button
            className={`relative py-3 px-4 w-full cursor-default rounded-lg text-sm text-left focus:outline-none focus-visible:ring-2 disabled:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 border ${
              error ? "border-red-500" : "border-gray-200"
            } ${!selectedOption.label && "text-placeholder"}`}
          >
            <span className="block truncate">
              {selectedOption.label || placeholder}
            </span>
            <SelectIcon error={error} />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-primary-ultra-light text-primary-dark"
                        : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-dark">
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </>
  );
};

function SelectIcon({ error }) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
      {error ? (
        <MdOutlineErrorOutline
          className="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
      ) : (
        <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
      )}
    </div>
  );
}

export default Select;

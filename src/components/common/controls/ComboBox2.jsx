import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { MdOutlineErrorOutline } from "react-icons/md";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const ComboBox2 = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  loading,
}) => {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? options
      : options.filter((item) =>
          item.value
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const selectedOption = options.find((option) => option.value === value) || {
    value: "",
    label: "",
  };

  const uniqueFilteredItems = Array.from(new Set(filteredItems.map(item => item.value)))
  .map(value => {
    return filteredItems.find(item => item.value === value);
  });

  return (
    <div>
      <Combobox
        value={selectedOption.value}
        onChange={onChange}
        disabled={disabled}
      >
        <div className="relative mt-1">
          <div
            className={`relative w-full cursor-default overflow-hidden rounded-lg text-sm text-left border ${
              error?.message ? "border-red-500" : "border-gray-200"
            } focus:outline-none`}
          >
            <Combobox.Input
              className="w-full border-none py-3 px-4 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
              displayValue={() => selectedOption?.label || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ComboBoxIcon error={error} />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredItems.length === 0 ? (
                <Combobox.Option
                  value={query}
                  className={() =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 text-gray-900`
                  }
                >
                  Create "{query}"
                </Combobox.Option>
              ) : (
                uniqueFilteredItems.map((item, index) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-primary-ultra-light text-primary-dark"
                          : "text-gray-900"
                      }`
                    }
                    value={item.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 text-primary-dark`}
                          >
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

function ComboBoxIcon({ error }) {
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

export default ComboBox2;

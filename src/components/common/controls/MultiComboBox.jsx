import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function MultiComboBox({
  name,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  loading,
}) {
  return (
    <div>
      <Select
        placeholder={placeholder}
        onChange={onChange}
        components={animatedComponents}
        // defaultValue={value}
        value={value}
        isMulti
        options={options}
        isLoading={loading}
        isDisabled={disabled}
        closeMenuOnSelect
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

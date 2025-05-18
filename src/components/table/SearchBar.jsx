import React from "react";
import { MdOutlineSearch } from "react-icons/md";

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="flex flex-1 w-full min-w-full md:min-w-80 max-w-96 h-[40px] min-h-11 bg-white text-openSan rounded-lg border px-4 items-center">
      <span className="text-[#909FBA] text-[15px]">
        <MdOutlineSearch />
      </span>
      <input
        className="w-full font-normal bg-transparent outline-none border-0 text-[13px]"
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

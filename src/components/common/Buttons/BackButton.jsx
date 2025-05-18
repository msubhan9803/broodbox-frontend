import React from "react";
import { useHistory } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";

export default function BackButton() {
    const history = useHistory();

  return (
    <div
      onClick={() => history.goBack()}
      className="flex items-center w-fit  cursor-pointer text-[#909FBA] text-[14px] leading-[29px] gap-[5px]"
    >
      <span>
        <MdArrowBackIosNew />
      </span>
      <span>Back</span>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HiOutlineXMark, HiCheckCircle } from "react-icons/hi2";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetFetchedPollinationState } from "../../../redux/Slices/PollinationMap";

export default function ExpandableNotification({ farmId }) {
  const toastId = farmId;
  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const dismiss = () => toast.dismiss(toastId);

  const handleRedirection = () => {
    dismiss();
    dispatch(resetFetchedPollinationState());
    history.push(`/pollination_map/map_detail/${farmId}`);
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="flex flex-col items-center justify-start relative overflow-hidden">
      <div
        className="bg-primary-ultra-light w-full rounded flex justify-between items-center h-16 p-2"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          <HiCheckCircle className="h-5 w-5 text-primary-main" />

          <h4 className="font-medium text-sm text-primary-main">
            {farmId} Pollination Map is ready
          </h4>
        </div>
        <div className="flex gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform cursor-pointer hover:bg-primary-light hover:bg-opacity-50 ${
              isOpen ? "rotate-180" : ""
            }`} // Rotate icon when open
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>

          <HiOutlineXMark
            className="h-5 w-5 cursor-pointer hover:bg-primary-light hover:bg-opacity-50"
            onClick={dismiss}
          />
        </div>
      </div>
      {isOpen && (
        <div className="w-full bg-white p-2 transition ease-out duration-300">
          <button
            onClick={handleRedirection}
            className="p-2 text-sm text-primary-main underline font-bold rounded mt-2"
          >
            View Pollination Map
          </button>
        </div>
      )}
    </div>
  );
}

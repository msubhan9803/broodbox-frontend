import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSelectedLocation,
  updatePage,
} from "../redux/Slices/ConfidenceCardListSlice";
import ConfidenceCard from "./ResultImages";
import FormPagination from "./FormPagination";

const ConfidenceCardList = () => {
  const selectionMenuRef = useRef();
  const [isLocationSelectionMenuActive, setIsLocationSelectionMenuActive] =
    useState(false);
  const data = useSelector((state) => state.confidenceCardList);
  const dispatch = useDispatch();

  const rows = 4;
  const columns = 2;
  const maxPerPage = rows * columns;

  const pagination = {
    current: data.page,
    max: Math.ceil(
      data.locations[data.selectedLocation].classes.length / maxPerPage
    ),
    onPreviousClick: () => {
      if (data.page <= 1) return;
      dispatch(updatePage(data.page - 1));
    },
    onNextClick: () => {
      if (
        data.page >=
        Math.ceil(
          data.locations[data.selectedLocation].classes.length / maxPerPage
        )
      )
        return;
      dispatch(updatePage(data.page + 1));
    },
  };

  const cards = data.locations[data.selectedLocation].classes.slice(
    (pagination.current - 1) * maxPerPage,
    pagination.current * maxPerPage
  );

  const handleOutsideClick = (e) => {
    if (
      selectionMenuRef.current &&
      !selectionMenuRef.current.contains(e.target)
    ) {
      setIsLocationSelectionMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <div className="w-full px-[24px] py-[25px] flex flex-col border border-[#F0F0F0] rounded-[20px] bg-white shadow-default">
      <div className="flex justify-between items-center">
        <div className="w-[250px] relative">
          <button
            onClick={() => {
              setIsLocationSelectionMenuActive((state) => !state);
            }}
            className="px-[16px] py-[12px] flex justify-between items-center gap-3 border border-meta-9 rounded-[8px] bg-white"
          >
            <p className="text-[#1F2937] text-[15px] tracking-[0.075px] font-semibold">
              Select Location
            </p>
            <svg
              viewBox="0 0 14 14"
              className="w-[14px] fill-none stroke-[#1F2937]"
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isLocationSelectionMenuActive && (
            <div
              ref={selectionMenuRef}
              className="w-full p-[8px] absolute top-16 left-0 flex flex-col border border-meta-9 rounded-[12px] bg-white shadow-default"
            >
              {data.locations.map((location, idx) => (
                <button
                  key={location + idx}
                  onClick={() => {
                    dispatch(updateSelectedLocation(idx));
                    setIsLocationSelectionMenuActive(false);
                  }}
                  className="w-full p-[8px] text-[#1F2937] text-left text-[14px] leading-[140%] tracking-[0.07[x]] font-medium rounded-[8px] hover:bg-[#F3F4F6]"
                >
                  Location {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-[30%] p-[12px] flex justify-between items-center rounded-[17px] bg-[#F4F7FE] shadow-default">
          <p className="text-[#230051] text-[16px] leading-[170%] tracking-[-0.3px] font-bold">
            Location Richness
          </p>
          <p className="mr-[24px] text-[#0D595A] text-[14px] leading-[170%] tracking-[-0.3px] font-bold">
            {data.locations[data.selectedLocation].locationRichness}%
          </p>
        </div>
      </div>

      <div
        className={`my-[48px] grid grid-rows-${rows} grid-cols-${columns} gap-x-[32px] gap-y-[12px]`}
      >
        {cards.map((classInfo, idx) => (
          <ConfidenceCard
            key={classInfo + idx}
            src={classInfo.src}
            alt={classInfo.alt}
            classLevel={classInfo.classLevel}
            confidence={classInfo.confidence}
          />
        ))}
      </div>

      <div className="self-end">
        <FormPagination {...pagination} />
      </div>
    </div>
  );
};

export default ConfidenceCardList;

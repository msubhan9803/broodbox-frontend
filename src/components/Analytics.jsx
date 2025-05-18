import { useRef, useState, useEffect, useContext, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedLocation } from "../redux/Slices/ConfidenceCardListSlice";
import CardBody from "./CardBody";
import RankingGlobal from "./RankingGlobal";
import RankingLocal from "./RankingLocal";
import Graph5 from "./home/Graph5";
import { DashboardContext } from "pages/Dashboard/DashboardContext";
import { useSpecificClassCountingData } from "hooks/useFarmManagement";
import Select from "./common/controls/Select";
import ResultImages from "./ResultImages";
import { useGetAllAreaLocationActiveFrams } from "hooks/useFarmManagement";

const Analytics = () => {
  const dispatch = useDispatch();
  const { farmId, businessAccountRef, areaCodes } =
    useContext(DashboardContext);

  const selectionMenuRef = useRef();
  const [isLocationSelectionMenuActive, setIsLocationSelectionMenuActive] =
    useState(false);
  const data = useSelector((state) => state.confidenceCardList);
  const [classCount, setClassCount] = useState("N/A");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedLocationCode, setSelectedLocationCode] = useState("");
  const [classStats, setClassStats] = useState({
    max_class: "",
    mean_class: "",
    min_class: "",
    mode_class: [],
  });
  const [locationRichness, setLocationRichness] = useState(null);

  const { data: specificData, refetch: specificDataRefetch } =
    useSpecificClassCountingData({
      farmId,
      businessAccountRef,
      areaCode: selectedArea?.area_code,
      locationCode: selectedLocationCode,
    });

  const { data: getAllAreaLocationActiveFramsData, isLoading: fetchIsLoading } =
    useGetAllAreaLocationActiveFrams({
      businessAccountRef,
      farmId,
    });

  const areaCodeList = useMemo(
    () =>
      getAllAreaLocationActiveFramsData
        ? Object.entries(getAllAreaLocationActiveFramsData).map(
            ([key, value]) => value
          )
        : [],
    [getAllAreaLocationActiveFramsData]
  );

  const areaCodeOptions = useMemo(
    () =>
      areaCodeList.length > 0
        ? areaCodeList.map(({ area_code }) => {
            return {
              value: area_code,
              label: `Area Code ${area_code}`,
            };
          })
        : [],
    [areaCodeList]
  );

  const locationCodeOptions = useMemo(
    () =>
      selectedArea
        ? selectedArea.locations.map(({ location_name }) => ({
            value: location_name,
            label: `Location Code ${location_name}`,
          }))
        : [],
    [selectedArea]
  );

  const findAreaCodeFromAreaList = (areaCode) =>
    areaCodeList.find((area) => area.area_code === areaCode);

  const handleOutsideClick = (e) => {
    if (
      selectionMenuRef.current &&
      !selectionMenuRef.current.contains(e.target)
    ) {
      setIsLocationSelectionMenuActive(false);
    }
  };

  const handleAreaChange = (selectedValue) => {
    const areaObject = findAreaCodeFromAreaList(selectedValue);
    setSelectedArea({ ...areaObject, index: selectedValue });
    setSelectedLocationCode(areaObject ? areaObject.location_code : "");
  };

  const classOptions = useMemo(() => {
    if (!specificData || !specificData.classes) return [];

    return Object.entries(specificData.classes).map(([key, value]) => ({
      value: key, // The key, like "0-8", "1-8", etc.
      label: `Class ${key} (${value.class_count})`, // Display label with class count
      classObject: value, // Storing the entire class object here
    }));
  }, [specificData]);

  // Handle class selection
  const handleClassChange = (value) => {
    console.log("Selected option:", value); // Debug: Print selected option to console
    const selectedOption = classOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      setSelectedClass({
        key: selectedOption.value,
        data: selectedOption.classObject, // Ensure this is correctly extracting the class object
      });
      setClassCount(selectedOption.classObject.class_count);
    } else {
      console.log("No matching class found for the selected value:", value);
    }
  };

  useEffect(() => {
    if (selectedArea) {
      // Trigger the hook to fetch specific data
      setSelectedClass(null);
      specificDataRefetch();
    }
  }, [selectedArea, selectedLocationCode, farmId, businessAccountRef]); // Dependency on area and location code

  useEffect(() => {
    if (specificData && !specificData.error) {
      console.log("Specific Data received:", specificData);
      setClassStats({
        max_class: specificData.class_stats.max_class,
        mean_class: specificData.class_stats.mean_class,
        min_class: specificData.class_stats.min_class,
        mode_class: specificData.class_stats.mode_class,
      });

      setLocationRichness(specificData.location_richness);
    }
  }, [specificData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <article className="w-full relative border border-light rounded-md drop-shadow-md">
      <CardBody>
        <div className="w-full flex flex-wrap justify-between items-center gap-[40px] md:gap-0 z-99">
          <div className="w-full md:w-[250px] relative">
            {areaCodes ? (
              <div className=" grid sm:flex sm:space-x-2 w-full md:w-[250px] relative">
                <Select
                  value={selectedArea ? selectedArea.index : ""}
                  options={areaCodeOptions}
                  name="area_code"
                  placeholder="Select Area Code"
                  onChange={handleAreaChange}
                />
                {selectedArea && (
                  <Select
                    value={selectedLocationCode}
                    options={locationCodeOptions}
                    placeholder="Select Location Code"
                    onChange={setSelectedLocationCode}
                  />
                )}
              </div>
            ) : (
              <p></p> // Display error message if there's an error
            )}
            {isLocationSelectionMenuActive && (
              <div
                ref={selectionMenuRef}
                className="w-full p-[8px] absolute top-16 left-0 flex flex-col border border-meta-9 rounded-[12px] bg-white shadow-default"
              >
                {data?.locations?.map((location, idx) => (
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
          <div className="w-full md:w-[30%] py-2 px-4 flex justify-between items-center rounded-lg bg-white drop-shadow-sm border border-gray-200">
            <p className="text-[#230051] text-[16px] leading-[170%] tracking-[-0.3px] font-bold">
              Location Richness
            </p>
            <p className="mr-[24px] text-[#0D595A] text-[14px] leading-[170%] tracking-[-0.3px] font-bold">
              {locationRichness && `${locationRichness}%`}
            </p>
          </div>
        </div>

        <div className="md:flex w-full justify-between ">
          <div className="flex-col self-start">
            <div className="w-full  flex ">
              <span className="w-full mt-[40px] grid  grid-cols-1  gap-x-[25%] gap-y-4">
                <span className="w-full flex justify-between items-center">
                  <p className="text-[#1B2559] text-[20px] font-bold">
                    Min Active frame class
                  </p>
                  <div className="relative font-bold">
                    {classStats.min_class}
                  </div>
                </span>
                <span className="w-full flex justify-between items-center">
                  <p className="text-[#1B2559] text-[20px]   font-bold">
                    Max Active frame class
                  </p>
                  <div className="relative font-bold">
                    {classStats.max_class}
                  </div>
                </span>
                <span className="w-full flex justify-between items-center">
                  <p className="text-[#1B2559] text-[20px]   font-bold">
                    Mean Active frame class
                  </p>
                  <div className="relative font-bold">
                    {classStats.mean_class}
                  </div>
                </span>
                <span className="w-full flex justify-between items-center">
                  <p className="text-[#1B2559] text-[20px]   font-bold">
                    Mode Active frame class
                  </p>
                  <div className="relative font-bold">
                    {classStats.mode_class}
                  </div>
                </span>
              </span>
            </div>
            <div className="self-start">
              <RankingGlobal
                ranking={specificData ? specificData.global_ranking : ""}
              />
              <RankingLocal
                ranking={specificData ? specificData.local_ranking : ""}
              />
            </div>
          </div>

          <div className="md:flex-3 w-full sm:w-2/3 flex items-center justify-center ">
            <Graph5 specificData={specificData} />
          </div>
        </div>

        <hr className="w-full border border-[#BBC5CA80] my-10" />
        <div className="flex w-full  self-start justify-between items-center">
          <Select
            value={selectedClass ? selectedClass.key : ""}
            options={classOptions}
            onChange={handleClassChange} // Setup onChange to update the selected class
            placeholder="Select Class"
          />
          <div className="font-medium ">Class Count: {classCount}</div>
        </div>
        {selectedClass &&
        selectedClass?.data?.image_names &&
        selectedClass.data.image_names.length !== 0 ? (
          <div className="overflow-y-auto">
            <ResultImages
              selectedClass={selectedClass}
              areaCode={specificData?.area_code}
              businessAccountRef={businessAccountRef}
              farmId={farmId}
              location_code={specificData?.location_code}
            />
          </div>
        ) : (
          <div className="py-48">
            <span className="text-gray-400 font-medium text-xl">No Data</span>
          </div>
        )}

        {/* <div className="self-end">
          <FormPagination {...pagination} />
        </div> */}
      </CardBody>
    </article>
  );
};

export default Analytics;

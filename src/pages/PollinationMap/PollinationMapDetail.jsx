import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdWatchLater } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  useFarmById,
  useTimeToGeneratePollinationMap,
  useGeneratePollinationMap,
  useUpdateSpatialProbability,
  useGetPredictions,
  usePollinationMapDateTime,
  useSpecificPollinationMapByDateTime,
  useGetLatestPollinationMapState,
  useGenerateFirstMap,
  useDidPredictionsRunOnce,
} from "hooks/useFarmManagement";
import TopHeading from "components/TopHeading";
import BackButton from "components/common/Buttons/BackButton";
import PollinationMap from "components/PollinationMap";
import Loader from "components/common/Loader";
import { insertNewFetchedMap } from "../../redux/Slices/PollinationMap";
import ToggleSwitch from "components/common/controls/ToggleSwitch";
import { MdOutlineFilterAlt } from "react-icons/md";
import DrawerDateTimeFilter from "components/DrawerDateTimeFilter";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import PredictionTable from "components/farmManagement/PredictionsTable";
import { convertStringToArray } from "utils/helper";

const CustomLoader = () => {
  return (
    <div className="h-8 w-8 lg:h-16 lg:w-16 animate-spin rounded-full border-4 border-solid border-primary-main border-t-transparent"></div>
  );
};

const Wrapper = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <BackButton />
      {children}
    </div>
  );
};

export default function PollinationMapDetail() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPollinationMap, setshowPollinationMap] = useState(false);
  const [beehives, setBeeHives] = useState([]);
  const [pollinationMapData, setPollinationMapData] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { farmId } = useParams();
  const {
    data: farmDetailData,
    isLoading: farmDetailLoading,
    refetch: farmDetailDataRefetch,
  } = useFarmById(farmId);

  const {
    data: timeToGeneratePollinationMapData,
    isLoading: timeToGeneratePollinationMapLoading,
    refetch: fetchTimeToGeneratePollinationMapData,
  } = useTimeToGeneratePollinationMap(farmId);

  const {
    data: generatePollinationMapData,
    isLoading: generatePollinationMapLoading,
    refetch: fetchGeneratePollinationMapData,
  } = useGeneratePollinationMap(farmId);

  const {
    data: updateSpatialProbabilityData,
    isLoading: updateSpatialProbabilityLoading,
    refetch: fetchUpdateSpatialProbabilityData,
  } = useUpdateSpatialProbability(farmId);

  const {
    data: getPredictionsData,
    isLoading: getPredictionsLoading,
    refetch: fetchGetPredictionsData,
  } = useGetPredictions(farmId);

  const {
    data: latestPollinationMapState,
    loading: latestPollinationMapStateLoading,
    refetch: latestPollinationMapStateRefetch,
  } = useGetLatestPollinationMapState(farmId);

  const { data: dateTimeData, refetch: dateTimeDataRefetch } =
    usePollinationMapDateTime(farmId);

  const handleRegeneration = async () => {
    const today = new Date().toISOString().slice(0, 10);
    let todaysVersionCount = 0;

    dateTimeData.forEach((item) => {
      if (item.date === today) {
        todaysVersionCount += 1;
      }
    });

    if (todaysVersionCount >= 24) {
      toast.error("Regeneration limited has been reached.");

      return;
    }

    // if (minutes > 15) {
    //   toast.error(
    //     "Regeneration is limited to the first 15 minutes of each hour. Please try again later."
    //   );

    //   return;
    // }

    setIsLoading(true);
    setIsRegenerating(true);

    fetchTimeToGeneratePollinationMapData()
      .then(async (res) => {
        setIsLoading(false);

        // await fetchGetPredictionsData();
        await fetchUpdateSpatialProbabilityData();
        await fetchGeneratePollinationMapData();

        latestPollinationMapStateRefetch();
        dateTimeDataRefetch();

        if (!window.location.pathname.includes("map_detail")) {
          dispatch(
            insertNewFetchedMap({
              farmId,
            })
          );
        }

        setIsRegenerating(false);
      })
      .catch((err) => setIsLoading(false));
  };

  useEffect(() => {
    if (farmDetailData) {
      setshowPollinationMap(farmDetailData.farm.isPollinationMapViewable);
    }
  }, [farmDetailData]);

  useEffect(() => {
    if (latestPollinationMapState && !latestPollinationMapState.error) {
      setPollinationMapData(latestPollinationMapState);
    }
  }, [latestPollinationMapState]);

  if (latestPollinationMapState && latestPollinationMapState.error) {
    return (
      <Wrapper>
        <PollinationMapUnavailableDueToInsufficientData
          farmId={farmId}
          farmDetailData={farmDetailData}
          latestPollinationMapStateRefetch={latestPollinationMapStateRefetch}
          dateTimeDataRefetch={dateTimeDataRefetch}
          timeToGeneratePollinationMapData={timeToGeneratePollinationMapData}
          fetchTimeToGeneratePollinationMapData={
            fetchTimeToGeneratePollinationMapData
          }
          farmDetailDataRefetch={farmDetailDataRefetch}
        />
      </Wrapper>
    );
  }

  if (farmDetailData && !farmDetailData.farm.isPollinationMapViewable) {
    return (
      <Wrapper>
        <PollinationMapUnavailable />
      </Wrapper>
    );
  }

  if (
    farmDetailLoading ||
    // !pollinationMapData ||
    latestPollinationMapStateLoading ||
    isLoading
    // !farmDetailData ||
    // timeToGeneratePollinationMapLoading
  )
    return <Loader />;

  if (isRegenerating && timeToGeneratePollinationMapData) {
    return (
      <Wrapper>
        <GeneratingPollinationMap data={timeToGeneratePollinationMapData} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showPollinationMap && (
        <PollinationMapContent
          heading="Pollination Map"
          farmDetailData={farmDetailData}
          beehives={beehives}
          setBeeHives={setBeeHives}
          pollinationMapData={pollinationMapData}
          setPollinationMapData={setPollinationMapData}
          latestPollinationMapStateRefetch={latestPollinationMapStateRefetch}
          isRegenerating={isRegenerating}
          handleRegeneration={handleRegeneration}
          dateTimeData={dateTimeData}
        />
      )}
    </Wrapper>
  );
}

function PollinationMapUnavailableDueToInsufficientData({
  farmId,
  farmDetailData,
  latestPollinationMapStateRefetch,
  timeToGeneratePollinationMapData,
  fetchTimeToGeneratePollinationMapData,
  farmDetailDataRefetch,
  dateTimeDataRefetch,
}) {
  const [mapGenerationLoading, setMapGenerationLoading] = useState(false);

  const generateFirstMap = useGenerateFirstMap();

  const { data: didPredictionsRunData, isLoading: didPredictionsRunLoading } =
    useDidPredictionsRunOnce(farmId);

  const doesBeehiveLocationsExists = useMemo(
    () => farmDetailData?.beehiveLocations?.length >= 1 || false,
    [farmDetailData]
  );
  const doesImagesExists = useMemo(
    () =>
      farmDetailData?.beehiveLocations?.some(
        (location) => convertStringToArray(location.img_urls).length >= 1
      ) || false,
    [farmDetailData]
  );

  const isGenerateButtonDisabled = () => {
    if (doesBeehiveLocationsExists && doesImagesExists) {
      if (mapGenerationLoading) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const handleGenerateAllPredictions = async () => {
    setMapGenerationLoading(true);

    await fetchTimeToGeneratePollinationMapData();

    generateFirstMap.mutate(
      {
        farmId,
      },
      {
        onSuccess: () => {
          toast.success("Predictions generated successfully");
          latestPollinationMapStateRefetch();
          dateTimeDataRefetch();
          setMapGenerationLoading(false);
        },
        onError: (error) => {
          toast.error(error.response.data.error);
          setMapGenerationLoading(false);
        },
      }
    );
  };

  return (
    <div className="grow flex flex-col items-center justify-center gap-8">
      {didPredictionsRunData && (
        <>
          {didPredictionsRunData.result === true ? (
            <>
              <h1 className="font-bold text-md lg:text-3xl w-3/4 text-center">
                No Pollination Map version generated yet. Please generate by clicking the button below.
              </h1>
              <h1 className="font-bold text-md lg:text-3xl w-3/4 text-center">
                {timeToGeneratePollinationMapData?.message}
              </h1>

              <button
                type="button"
                className="w-auto min-w-32 h-[40px] px-3 flex justify-center items-center text-white gap-[5px] bg-primary-main disabled:bg-primary-light rounded-lg"
                disabled={isGenerateButtonDisabled()}
                onClick={() => handleGenerateAllPredictions()}
              >
                {generateFirstMap.isLoading ? (
                  <ButtonSpinner />
                ) : (
                  "Generate first map"
                )}
              </button>
            </>
          ) : (
            <>
              <h1 className="font-bold text-md lg:text-3xl w-3/4 text-center">
                Please go to Farm detail to generate predictions first then you'll able to generate map.
              </h1>

              <Link
                to={`/farm_management/farm_detail/${farmId}`}
                className="w-auto min-w-32 h-[40px] px-3 flex justify-center items-center text-white gap-[5px] bg-primary-main disabled:bg-primary-light rounded-lg"
              >
                Go to Farm detail
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}

function PollinationMapUnavailable() {
  return (
    <div className="grow flex flex-col items-center justify-center gap-8">
      <h1 className="font-bold text-md lg:text-3xl w-3/4 text-center">
        The pollination map is unavailable. It will be available once the
        Spatial data has been updated.
      </h1>
    </div>
  );
}

function GeneratingPollinationMap({ data }) {
  return (
    <div className="grow flex flex-col items-center justify-center gap-8">
      <CustomLoader />

      <h1 className="font-bold text-md lg:text-3xl w-3/4 text-center">
        The pollination map is generating. {data.message}
      </h1>

      <h2 className="font-normal text-sm lg:text-2xl w-3/4 text-center">
        You will be notified once it's available.
      </h2>
    </div>
  );
}

function PollinationMapContent({
  heading,
  farmDetailData,
  beehives,
  setBeeHives,
  pollinationMapData,
  setPollinationMapData,
  isRegenerating,
  handleRegeneration,
  dateTimeData,
}) {
  const [activeTab, setActiveTab] = useState("spatial");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [datesList, setDatesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const { farmId } = useParams();

  const handleClose = () => {
    setIsOpen(false);
  };

  function groupByDate(data) {
    debugger;
    if (!data) return {};

    return data.reduce((acc, { date, time }) => {
      if (!acc[date]) {
        acc[date] = { date, times: [] };
      }
      acc[date].times.push(time);
      return acc;
    }, {});
  }

  const handleDateClick = (date) => {
    const adjustedDate = new Date(date.setHours(0, 0, 0, 0));
    setSelectedDate(adjustedDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (datesList.some((d) => date.getTime() === d.getTime())) {
        return "highlight-date";
      }
    }
  };

  const findTimesForSelectedDate = () => {
    if (!selectedDate) return null;

    // Format selectedDate to match the 'groupData' date format
    const selectedDateString = [
      selectedDate.getFullYear(),
      ("0" + (selectedDate.getMonth() + 1)).slice(-2),
      ("0" + selectedDate.getDate()).slice(-2),
    ].join("-");

    // Find the matching date object in groupData
    const dateObject = groupedData.find(
      (item) => item.date === selectedDateString
    );
    return dateObject ? dateObject.times : null;
  };

  const useMutateSpecificPollinationMap = useSpecificPollinationMapByDateTime();

  const handleFilter = () => {
    const params = {
      farmId,
      date: moment(selectedDate).format("yyyy-MM-DD"),
      time: selectedTime,
    };
    const onSuccess = (data) => {
      setPollinationMapData((prevData) => {
        // Extract existing final_map, spatial_map, and hive_locations from the previous state
        const { final_map, spatial_map, hive_locations, ...rest } = prevData;
        // Extract new final_map, spatial_map, and hive_locations from the received data
        const {
          final_map: newFinalMap,
          spatial_map: newSpatialMap,
          hive_locations: newHiveLocations,
          ...newData
        } = data[0];

        return {
          ...rest,
          ...newData,
          final_map: newFinalMap,
          spatial_map: newSpatialMap,
          hive_locations: newHiveLocations, // Add the new hive_locations to the state
        };
      });
      setLoading(false);
      setIsOpen(false);
      console.log("Successfully Fetched Data", data);
    };
    const onError = (error) => {
      setLoading(false);
      setIsOpen(false);
      console.log(error);
    };

    if (selectedDate && selectedTime) {
      setLoading(true);
      useMutateSpecificPollinationMap.mutate(params, { onSuccess, onError });
    }
  };

  useEffect(() => {
    if (farmId && dateTimeData) {
      debugger;
      const groupedByDate = groupByDate(dateTimeData);
      const result = Object.values(groupedByDate);

      const dates = result.map((item) => {
        const [year, month, day] = item.date.split("-").map(Number);
        return new Date(year, month - 1, day);
      });
      setDatesList(dates);
      setGroupedData(result);
    }
  }, [dateTimeData, farmId]);

  return (
    <>
      <TopHeading mainHeading={heading} />
      <DrawerDateTimeFilter
        isOpen={isOpen}
        handleClose={handleClose}
        title="Filter Map by Date/Time"
        loading={false}
      >
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-x-4 divide-y lg:divide-x lg:mt-4">
          <Calendar
            className="m-auto"
            onClickDay={handleDateClick}
            tileClassName={tileClassName}
          />

          <div className="pt-4 lg:px-4 grow flex flex-col">
            <span className="font-bold text-md">Select Time</span>
            <div className="grow overflow-y-auto max-h-[316px]">
              {!findTimesForSelectedDate() ? (
                <div className="text-center place-self-center">
                  <p>No time slot</p>
                </div>
              ) : (
                <ul>
                  {findTimesForSelectedDate().map((time, index) => (
                    <li
                      onClick={() => setSelectedTime(time)}
                      key={index}
                      className={`cursor-pointer my-2 border rounded-lg p-2 text-center ${
                        selectedTime === time
                          ? "bg-primary-main text-white font-bold"
                          : "bg-white text-black"
                      }`}
                    >
                      {time}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 flex justify-end absolute bottom-2 right-2 border-t-gray-200 md:rounded-bl-xl">
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-500 w-[153px] h-[46px] rounded-lg mr-4"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleFilter}
            type="button"
            className="bg-primary-main disabled:bg-primary-light text-white w-[153px] h-[46px] rounded-lg flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <ButtonSpinner /> : "Filter"}
          </button>
        </div>
      </DrawerDateTimeFilter>

      <div className="mt-8 pb-4 my-4">
        <div className="w-full flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 justify-start lg:justify-between">
          <TopHeading
            subHeading={
              farmDetailData?.farm?.businessAccountRef?.businessAccountName
            }
            mainHeading={`${farmDetailData?.farm?.farmId} - ${farmDetailData?.farm?.title}`}
            primaryTextColor="text-primary-dark"
          />

          <div className="mt-4 sm:mt-0 flex gap-x-4 items-end">
            <div className="flex flex-col md:flex-row justify-center gap-y-2 md:gap-y-0 gap-x-4">
              <div
                className="flex gap-x-2 items-center min-w-32 cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <MdOutlineFilterAlt />
                <span> Filter By Date</span>
              </div>

              <div>
                <ToggleSwitch
                  active={activeTab}
                  setActive={setActiveTab}
                  label1="Spatial"
                  label2="Final"
                />
              </div>

              <button
                onClick={handleRegeneration}
                type="button"
                className="w-auto h-[40px] px-3 flex justify-center items-center text-white gap-[5px] bg-primary-main rounded-lg "
              >
                {isRegenerating ? <ButtonSpinner /> : "Regenerate"}
              </button>
            </div>
          </div>
        </div>

        {pollinationMapData && (
          <div className="pt-4 lg:pt-6">
            <button className="flex items-center gap-x-2 bg-primary-light-2 border-2 border-primary-main rounded-md px-4 py-1 lg:ml-auto cursor-default">
              <MdWatchLater className="text-primary-dark h-5 w-5" />
              <span className=" font-bold">
                {moment(
                  `${pollinationMapData.date}T${pollinationMapData.time}`
                ).format("lll")}
              </span>
            </button>
          </div>
        )}

        {pollinationMapData && (
          <div className="border bg-white border-light drop-shadow-md rounded-md p-4 my-6">
            <PollinationMap
              state={pollinationMapData}
              activeTab={activeTab}
              farmDetailData={farmDetailData}
            />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-dark">Predictions</h1>
          {farmDetailData && (
            <PredictionTable
              beehives={farmDetailData?.beehiveLocations}
              businessAccountRef={farmDetailData}
              farmDetailData={farmDetailData}
            />
          )}
        </div>
      </div>
    </>
  );
}

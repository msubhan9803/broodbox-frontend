import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ComboBox from "components/common/controls/ComboBox";
import { useGetAllAreaLocationActiveFrams } from "hooks/useFarmManagement";
import { DashboardContext } from "pages/Dashboard/DashboardContext";

const Graph2 = () => {
  const [selectedArea, setSelectedArea] = useState(null); // State to hold the selected area object
  const [data, setData] = useState(null); // State to hold the fetched data
  const [isLoading, setIsLoading] = useState(false);
  const { farmId, businessAccountRef } = useContext(DashboardContext);

  const { data: fetchedData, isLoading: fetchIsLoading } =
    useGetAllAreaLocationActiveFrams({
      businessAccountRef,
      farmId,
    });

  useEffect(() => {
    // Convert the fetched data to an array of objects
    if (farmId) {
      const dataArray = fetchedData ? Object.values(fetchedData) : null;
      setData(dataArray);
      setIsLoading(fetchIsLoading);
    }
  }, [fetchedData, fetchIsLoading, farmId, businessAccountRef]);

  const [chartSumActiveData, setChartSumActiveData] = useState({
    series: [], // Initially empty series
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [], // Initially empty categories
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "Total Frames : " + val;
          },
        },
      },
    },
  });

  // const data = [
  //   {
  //     area_code: "54",
  //     locations: [
  //       {
  //         location_name: "22",
  //         total_active_frames: 70,
  //       },
  //     ],
  //   },
  //   {
  //     area_code: "87",
  //     locations: [
  //       {
  //         location_name: "56",
  //         total_active_frames: 29,
  //       },
  //     ],
  //   },
  // ];
  const areaCodeOptions =
    Array.isArray(data) && data.every((area) => area?.area_code)
      ? data.map((area) => ({
          value: area?.area_code,
          label: `Area Code ${area?.area_code}`,
        }))
      : [];

  const handleAreaCodeChange = (selectedAreaCode) => {
    const selectedAreaObject = data?.find(
      (area) => area.area_code === selectedAreaCode
    );
    setSelectedArea(selectedAreaObject);

    // Update chart data based on the selected area
    const newChartData = selectedAreaObject.locations.map((location) => ({
      name: location.location_name,
      data: [location.total_active_frames],
    }));

    setChartSumActiveData({
      series: newChartData,
      options: {
        ...chartSumActiveData?.options,
        xaxis: {
          categories: [selectedAreaObject?.area_code],
        },
      },
    });
  };
  return (
    <div className="w-full relative">
      <div className="relative top-0 min-h-fit h-full justify-between border bg-white border-light drop-shadow-md max-sm:p-[10px] p-[24px] rounded-md ">
        <div className="w-full grid md:flex items-center mx-auto ">
          <h1 className="text-center flex flex-1 justify-center text-graydark font-semibold text-2xl">
            Sum of Active Frames
          </h1>
          <div className="w-full md:w-[200px] ">
            <ComboBox
              id="businessAccountRef"
              value={selectedArea?.area_code}
              onChange={handleAreaCodeChange}
              placeholder="Select Area Code"
              options={areaCodeOptions}
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>

        <div id="chart" className=" w-full mt-[20px] max-sm:mt-[40px]">
          <ReactApexChart
            options={chartSumActiveData?.options}
            series={chartSumActiveData?.series}
            type="bar"
          />
        </div>
      </div>
    </div>
  );
};

export default Graph2;

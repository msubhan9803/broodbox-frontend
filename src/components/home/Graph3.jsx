import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { DashboardContext } from "pages/Dashboard/DashboardContext";
import { useGetAllDataAsList } from "hooks/useFarmManagement";

const Graph3 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { farmId, businessAccountRef } = useContext(DashboardContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { data: fetchedList, isLoading } = useGetAllDataAsList({
    businessAccountRef,
    farmId,
  });

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "bar",
        zoom: { enabled: true },
        toolbar: { show: true },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: [] },
      yaxis: [
        { min: 0 },
        {
          min: 0.0,
          tickAmount: 5,
          labels: { formatter: (val) => val.toFixed(1) },
          opposite: true,
          title: { text: "Location Richness" },
        },
      ],
    },
  });

  useEffect(() => {
    if (fetchedList && fetchedList.error) {
      // Set chart data to an empty state while maintaining structure
      setChartData({
        series: [],
        options: {
          chart: {
            height: 350,
            type: "bar",
            zoom: { enabled: false },
            toolbar: { show: false },
          },
          plotOptions: {
            bar: { horizontal: false },
          },
          xaxis: {
            categories: [],
          },
          yaxis: [{ show: false }],
        },
      });
    } else if (fetchedList) {
      const areaCodes = fetchedList.area_codes;
      const totalActiveFrames = fetchedList.total_active_frames.flat();
      const locationRichness = fetchedList.location_richness.flat();

      setChartData({
        series: [
          {
            name: "Total Active Frames",
            data: totalActiveFrames,
          },
          {
            name: "Location Richness",
            data: locationRichness,
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "bar",
            zoom: { enabled: true },
            toolbar: { show: true },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          dataLabels: { enabled: false },
          stroke: { show: true, width: 2, colors: ["transparent"] },
          xaxis: {
            categories: areaCodes,
          },
          yaxis: [
            { min: 0 },
            {
              min: 0.0,
              tickAmount: 5,
              labels: { formatter: (val) => val.toFixed(1) },
              opposite: true,
              title: { text: "Location Richness" },
            },
          ],
        },
      });
    }
  }, [fetchedList]);

  return (
    <div className="w-full relative selector2">
      <div className="relative top-0 flex min-h-fit h-full flex-col justify-between border bg-white border-light drop-shadow-md max-sm:p-[10px] p-[24px] rounded-md">
        <h1 className="text-center text-graydark font-semibold text-2xl">
          Active Frame Counts with Location Richness
        </h1>{" "}
        {!isLoading && (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
          />
        )}
      </div>
    </div>
  );
};

export default Graph3;

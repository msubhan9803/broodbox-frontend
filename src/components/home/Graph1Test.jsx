import React, { useContext, useState, useEffect } from "react";
import { DashboardContext } from "pages/Dashboard/DashboardContext";
import ReactApexChart from "react-apexcharts";

const Graph1 = () => {
  const {
    setFarmId,
    farmId,
    setBusinessAccountRef,
    businessAccountRef,
    totalActiveFrames,
  } = useContext(DashboardContext);

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Active Frames",
        data: [], // Initially empty
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar", // Changed to 'bar' for bar chart
        toolbar: {
          show: false, // Optional: removes the toolbar
        },
      },
      plotOptions: {
        bar: {
          horizontal: false, // Set to true if you want horizontal bars
          columnWidth: "55%",
          endingShape: "rounded", // Optional: adds rounded corners to the bars
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
        title: {
          text: "Area Codes",
        },
        categories: [],
      },
      yaxis: {
        title: {
          text: "Active Frame Count",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " frames";
          },
        },
      },
    },
  });

  useEffect(() => {
    if (totalActiveFrames) {
      setChartData((prevState) => ({
        ...prevState,
        series: [{ data: totalActiveFrames.total_active_frames }],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: totalActiveFrames.area_code,
          },
        },
      }));
    }
  }, [totalActiveFrames]);

  return (
    <div className="w-full relative">
      <div className="relative top-0 flex flex-col min-h-fit h-full justify-between border bg-white border-light drop-shadow-md max-sm:p-[10px] p-[24px] rounded-md">
        <h1 className="text-center text-graydark font-semibold text-2xl">
          Total Active Frames with Areas
        </h1>
        <div id="chart" className=" w-full mt-[20px] max-sm:mt-[40px]">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
          />
        </div>
      </div>
    </div>
  );
};

export default Graph1;

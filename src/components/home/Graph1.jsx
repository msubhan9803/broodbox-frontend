import React from "react";
import { useState } from "react";
import Graph from "../../images/icons/Graph.svg";
import ReactApexChart from "react-apexcharts";

const Graph1 = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },

      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  });

  return (
    <div className="relative">
      <div className="absolute flex items-center max-sm:w-[100%] max-sm:top-[-13%] justify-around py-[20px] max-sm:px-[10px]: px-[25px] rounded-[17px] max-sm:gap-3 gap-[50px] z-10 max-w-[400px] left-[-10%] bg-[#230051] text-white top-[-10%]">
        <h3 className="text-[24px] max-sm:text-lg font-bold text-roboto">
          Total Active Frames <br className="max-sm:hidden" /> with Areas{" "}
        </h3>
        <img src={Graph} alt="Graph Icon" className="max-sm:w-[30px] h-auto" />
      </div>
      <div className="relative top-0 max-w-[650px] flex h-[460px] border bg-white border-light drop-shadow-md max-sm:p-[10px] p-[24px]">
        <div
          id="chart"
          className=" w-full mt-[20px] max-sm:mt-[40px] h-[396px]"
        >
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Graph1;

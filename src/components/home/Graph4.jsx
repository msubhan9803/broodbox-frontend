import React from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Graph4 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "location 1",
        data: [44, 55, 41, 37],
      },
      {
        name: "location 2",
        data: [20, 21, 10, 10],
      },
      {
        name: "location 3",
        data: [],
      },
      {
        name: "location 4",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["location 1", "location 2", "location 3", "location 4"],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        offsetX: 40,
      },
      colors: ["#145adb", "#dbaa23", "#0000ff", "#ffff00", "#ff00ff"], // Change Colors Here
    },
  });
  return (
    <div className="w-full relative selector2">
      <div className="relative top-0 flex min-h-fit h-full flex-col justify-between border bg-white border-light drop-shadow-md max-sm:p-[10px] p-[24px] rounded-md">
        <h1 className="text-center text-graydark font-semibold text-2xl">
          Active Frame Distribution of Area Code
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

export default Graph4;

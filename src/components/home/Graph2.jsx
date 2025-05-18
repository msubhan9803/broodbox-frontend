import React from "react";
import { useState } from "react";
import Graph from "../../images/icons/Graph.svg";
import ReactApexChart from "react-apexcharts";

const Graph2 = () => {
  const [chartSumActiveData, setChartSumActiveData] = useState({
    series: [
      {
        name: "Area Code 1",
        data: [44, 55, 57],
      },
      {
        name: "Area Code 2",
        data: [76, 85, 101],
      },
      {
        name: "Area Code 3",
        data: [35, 41, 36],
      },
    ],
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
        categories: ["Area Code 1", "Area Code 2", "Area Code 3"],
      },
      yaxis: {
        title: {
          text: "Sum of active frames",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  });
  return (
    <div className="relative ">
      <div className="absolute flex items-center max-sm:w-[100%] max-sm:top-[-13%]  justify-around py-[20px] max-sm:px-[10px]: px-[25px] rounded-[17px] max-sm:gap-3 gap-[50px] z-10 max-w-[400px] left-[-10%]   bg-[#230051] text-white top-[-10%]">
        <h3 className="text-[24px] max-sm:text-lg font-bold text-roboto">
          Sum of Active <br className="max-sm:hidden" /> Frames{" "}
        </h3>
        <img src={Graph} alt="Graph Icon" className="max-sm:w-[30px] h-auto" />
      </div>
      <div className="relative top-0 max-w-[650px]    h-[460px] border bg-white border-light drop-shadow-md max-sm:p-[10px] p-[24px]  rounded-md ">
        <div
          id="chart"
          className=" w-full mt-[20px] max-sm:mt-[40px] h-[396px] "
        >
          <ReactApexChart
            options={chartSumActiveData.options}
            series={chartSumActiveData.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Graph2;

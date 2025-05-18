import CardBody from "components/CardBody";
import TopHeading from "components/TopHeading";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Graph5 = ({ specificData }) => {
  // Initial state setup for chart data
  const [chartData, setChartData] = useState({
    series: [],
    labels: [], // This will store the class names
    options: {
      chart: {
        type: "donut",
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.9,
              width: 10,
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          // Display the class name corresponding to the segment
          return opts.w.globals.labels[opts.seriesIndex];
        },
        style: {
          fontSize: "16px",
          fontFamily: "Roboto, Arial, sans-serif",
          fontWeight: "600",
          colors: ["#fff"],
        },
        dropShadow: {
          enabled: false,
        },
      },
      plotOptions: {
        pie: {
          customScale: 1,
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: "Total:",
                fontSize: "22px",
                fontFamily: "Roboto, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return (
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0) +
                    " Class Count"
                  );
                },
              },
              name: {
                show: true,
                fontSize: "18px",
                fontFamily: "Verdana, Arial, sans-serif",
                fontWeight: 600,
                color: undefined,
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val;
                },
              },
            },
            size: "75%", // Increased size
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
      },
      tooltip: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 768, // Tailwind's sm breakpoint
          options: {
            chart: {
              height: 350, // Maintain height irrespective of the device
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    total: {
                      fontSize: "16px", // Smaller font size for mobile
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  // Effect hook to update chart data based on specificData
  useEffect(() => {
    if (specificData && specificData.classes) {
      const newSeries = [];
      const newLabels = [];
      for (const [key, item] of Object.entries(specificData.classes)) {
        newSeries.push(item.class_count);
        newLabels.push(`Class ${key}`); // Adding class names as labels
      }
      setChartData((prevState) => ({
        ...prevState,
        series: newSeries,
        options: {
          ...prevState.options,
          labels: newLabels, // Set labels in chart options for access in formatter
        },
      }));
    }
  }, [specificData]);

  return (
    <article className="w-full relative text-center">
      <h3 className="text-[#2C0A58] text-[24px] font-bold">
        Classes x Class Count
      </h3>
      <div className="w-full relative">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          labels={chartData.labels}
        />
      </div>
    </article>
  );
};

export default Graph5;

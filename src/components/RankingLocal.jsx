import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import CardBody from "./CardBody";

const RankingGlobal = ({ ranking }) => {
  // const ranking = useSelector((state) => state.ranking.localRanking);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#490B8D", "#FFFFFF"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  const placeholderChartSeries = [65, 35];

  return (
    <article className="w-full relative">
      <CardBody className="">
        <h3 className="text-[#2C0A58] text-[24px]  leading-[170%] tracking-[-0.3px] font-bold">
          Local Ranking
        </h3>
        <div className="w-full md:w-[80%] relative">
          <ReactApexChart
            options={chartOptions}
            series={placeholderChartSeries}
            type="donut"
          />
          <p className="absolute top-1/2 left-1/2 lg:left-[60%] -translate-x-1/2 -translate-y-1/2 text-[#2C0A58] text-[48px] leading-[87.5%] tracking-[-0.96px] font-bold">
            {ranking}
          </p>
        </div>
      </CardBody>
    </article>
  );
};

export default RankingGlobal;

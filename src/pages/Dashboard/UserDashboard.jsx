import { useContext } from "react";
import Graph1Test from "components/home/Graph1Test";
import Graph2Test from "components/home/Graph2Test";
import BeehiveTableDasboard from "components/BeehiveTableDasboard";
import Analytics from "components/Analytics";
import TopHeading from "components/TopHeading";
import { useFarmById } from "hooks/useFarmManagement";
import { DashboardProvider } from "./DashboardContext";
import ComboBoxes from "./SelectBusinessFarm";
import { DashboardContext } from "pages/Dashboard/DashboardContext";

function UserDashboard() {
  const { farmId, businessAccountRef, setAreaCodes } =
    useContext(DashboardContext);
  const { data: farmDetailData, isLoading: farmDetailLoading } =
    useFarmById(farmId);

  return (
    <div className="text-roboto">

      <div className="flex flex-col xl:flex-row justify-between items-start">
        <div className="mb-8 self-start">
          <TopHeading mainHeading="Dashboard" />
        </div>
        <div className="self-start w-full md:w-auto">
          <ComboBoxes />
        </div>
      </div>

      {farmDetailData && !farmDetailData.farm.isPollinationMapViewable ? (
        <div className="w-full h-full flex flex-col mt-36">
          <div className="grow flex flex-col items-center justify-center gap-8">
            <h1 className="font-bold text-md lg:text-3xl w-3/4 text-center">
              The dashboard analytics are unavailable. They are going to be
              available once the Spatial data has been updated.
            </h1>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 xl:mt-8 flex flex-col xl:flex-row justify-start items-stretch gap-10 xl:gap-4">
            <Graph1Test />
            <Graph2Test />
          </div>

          {/* <div className="xl:w-[49.5%] mt-10 ">
            <Graph3 />
            <Graph4 />
          </div> */}

          <div className="mt-10 xl:mt-20">
            <BeehiveTableDasboard />
          </div>

          <div className="mt-10 xl:mt-20">
            <Analytics />
          </div>

          {/* <div className="mt-10 xl:mt-20">
            <AGGridForm />
          </div> */}
        </>
      )}
    </div>
  );
}

const DashboardWrapper = () => {
  return (
    <DashboardProvider>
      <UserDashboard />
    </DashboardProvider>
  );
};

export default DashboardWrapper;

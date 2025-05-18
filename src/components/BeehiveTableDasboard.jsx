import { useContext, useEffect, useRef, useState } from "react";
import { DashboardContext } from "pages/Dashboard/DashboardContext";
import { useGetAllData } from "hooks/useFarmManagement";
import Pagination from "./table/Pagination";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";
import Table from "./table/Table";
import InfoPopover from "components/InfoPopover";

const BeehiveTableDasboard = () => {
  const formRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);

  const { farmId, businessAccountRef, setAreaCodes } =
    useContext(DashboardContext);

  const {
    data: fetchedData,
    isLoading,
    error,
  } = useGetAllData({
    farmId,
    businessAccountRef,
    search: searchQuery,
    limit: 4,
    page: currentPage,
    sortBy: `${sort.field}:${sort.direction}`,
  });
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (newSortField) => {
    setSort({
      field: newSortField,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  };

  useEffect(() => {
    if (fetchedData && !fetchedData.data.error) {
      setAreaCodes(fetchedData.data);
    } else {
      setAreaCodes(null);
    }
  }, [fetchedData, setAreaCodes]);
  // Correctly access the data array
  // const data = fetchedData && fetchedData.data ? fetchedData.data : [];
  // const hasData = data.length > 0;

  if (farmId === null) return <div></div>;
  // if (error) return <div>Error: {error.message}</div>;

  const beehiveTableConfig = {
    columns: [
      {
        headerName: "Area Code",
        field: "area_code",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">{data?.area_code}</span>
        ),
        renderSortIcon: () =>
          sort.field === "area_code" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("area_code"),
      },
      {
        headerName: "Location Code",
        field: "location_code",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">{data?.location_code}</span>
        ),
        renderSortIcon: () =>
          sort.field === "location_code" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("location_code"),
      },
      {
        headerName: "Global Ranking",
        renderInfo: () => (
          <InfoPopover text="This is the Global Ranking information" />
        ),
        field: "global_ranking",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">
            {data?.global_ranking}
          </span>
        ),
        renderSortIcon: () =>
          sort.field === "global_ranking" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("global_ranking"),
      },
      {
        headerName: "Local Ranking",
        renderInfo: () => (
          <InfoPopover text="This is the Local Ranking information" />
        ),
        field: "local_ranking",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">{data?.local_ranking}</span>
        ),
        renderSortIcon: () =>
          sort.field === "local_ranking" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("local_ranking"),
      },
      {
        headerName: "Location Richness",
        renderInfo: () => (
          <InfoPopover text="This is the Location Richness information" />
        ),
        field: "location_richness",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">
            {data?.location_richness}%
          </span>
        ),
        renderSortIcon: () =>
          sort.field === "location_richness" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("location_richness"),
      },
      {
        headerName: "Total Active Frames",
        field: "total_active_frames",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">
            {data?.total_active_frames}
          </span>
        ),
        renderSortIcon: () =>
          sort.field === "total_active_frames" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("total_active_frames"),
      },
      {
        headerName: "Total Bee Hives",
        field: "total_beehives",
        sortable: true,
        render: (data) => (
          <span className="flex items-center gap-2">
            {data?.total_beehives}
          </span>
        ),
        renderSortIcon: () =>
          sort.field === "total_beehives" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("total_beehives"),
      },
    ],
  };

  return (
    <div
      ref={formRef}
      className="w-full border border-light rounded-md shadow-md bg-white p-6"
    >
      <div className="mb-4 w-full flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-y-0">
        <h1 className="text-center text-graydark font-semibold text-2xl">
          Beehive Area and Location Statistics
        </h1>

        <input
          type="text"
          placeholder="Search by Area or Location Code"
          onChange={handleSearchChange}
          value={searchQuery}
          className="w-full max-w-64 p-2 border outline-none border-gray-300 rounded-md "
        />
      </div>
      {fetchedData ? (
        <div className="w-full overflow-x-auto">
          <Table
            data={fetchedData?.data || []}
            isLoading={isLoading}
            {...beehiveTableConfig}
          />
        </div>
      ) : (
        <p className="text-center">No data available.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={fetchedData?.pagination?.total_pages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BeehiveTableDasboard;

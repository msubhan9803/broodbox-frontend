/* eslint-disable no-unused-vars */
import TopHeading from "components/TopHeading";
import BackButton from "components/common/Buttons/BackButton";
import Pagination from "components/table/Pagination";
import SearchBar from "components/table/SearchBar";
import Table from "components/table/Table";
import { useGetAllCameras } from "hooks/useCamera";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CameraManagement = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);

  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });

  const { data: allCameras, isLoading: allCamerasLoading } = useGetAllCameras({
    search: searchQuery,
    sortBy: `${sort.field}:${sort.direction}`,
    page: currentPage,
    limit,
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  function formatTimestamp(timestamp) {
    // Parse the timestamp using Moment.js
    const date = moment(timestamp);

    // Format the date according to the desired format
    const formattedDate = date.format("MMMM D, YYYY");

    return formattedDate;
  }
  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === "asc";
    setSort({
      field,
      direction: isAsc ? "desc" : "asc",
    });
  };

  const cameraTableConfig = {
    columns: [
      {
        headerName: "ID",
        field: "cameraId",
        sortable: true,
        render: (data) => (
          <>
            {<span className="flex items-center gap-2 ">{data?.cameraId}</span>}
          </>
        ),
        renderSortIcon: () =>
          sort.field === "cameraId" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("cameraId"),
      },
      {
        headerName: "Model",
        field: "model",
        sortable: true,
        render: (data) => (
          <>
            {
              <span className="flex items-center gap-2 capitalize">
                {data?.model}
              </span>
            }
          </>
        ),
        renderSortIcon: () =>
          sort.field === "model" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("model"),
      },
      {
        headerName: "Make",
        field: "title",
        sortable: true,
        render: (data) => (
          <>
            {
              <span className="flex items-center gap-2 font-bold ">
                {data?.title}
              </span>
            }
          </>
        ),
        renderSortIcon: () =>
          sort.field === "title" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("title"),
      },
      {
        headerName: "Bussiness Acc",
        field: "businessAccountRef.businessAccountName",
        sortable: true,
        render: (data) => (
          <>
            {
              <span className="flex items-center gap-2 ">
                {data?.businessAccountRef?.businessAccountName || ""}
              </span>
            }
          </>
        ),
        renderSortIcon: () =>
          sort.field === "businessAccountRef.businessAccountName" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () =>
          handleSortChange("businessAccountRef.businessAccountName"),
      },
      {
        headerName: "Assigned To Farm",
        field: "assignedToFarm.title",
        sortable: true,
        render: (data) => (
          <>
            {
              <span className="flex items-center gap-2 ">
                {data?.assignedToFarm?.title || ""}
              </span>
            }
          </>
        ),
        renderSortIcon: () =>
          sort.field === "assignedToFarm.title" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("assignedToFarm.title"),
      },
      {
        headerName: "Lend Date",
        field: "lendDate",
        sortable: true,
        render: (data) => (
          <>
            {
              <span className="flex items-center gap-2 ">
                {data?.lendDate ? formatTimestamp(data.lendDate) : ""}
              </span>
            }
          </>
        ),
        renderSortIcon: () =>
          sort.field === "lendDate" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("lendDate"),
      },
      {
        headerName: "Due Date",
        field: "returnDate",
        sortable: true,
        render: (data) => (
          <>
            {
              <span className="flex items-center gap-2 ">
                {data?.returnDate ? formatTimestamp(data.returnDate) : ""}
              </span>
            }
          </>
        ),
        renderSortIcon: () =>
          sort.field === "returnDate" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("returnDate"),
      },
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        render: (data) => (
          <>
            <div
              className={
                data?.status === "available"
                  ? "text-[#22BB33] capitalize items-center font-bold"
                  : data?.status === "decommissioned"
                  ? "text-red-500 capitalize items-center font-bold"
                  : "text-[#479BFD] capitalize items-center font-bold"
              }
            >
              {data?.status}
            </div>
          </>
        ),
        renderSortIcon: () =>
          sort.field === "status" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("status"),
      },
    ],
    actions: [
      {
        // label: "Manage Images",
        label: <div className=" font-bold">Details</div>,
        onClick: (row) => ({
          pathname: `/camera_management/edit/${row.cameraId}`,
          state: { ...row },
        }),
      },
    ],
  };

  // useEffect(() => {
  //   if (user?.user?.role !== "superAdmin") {
  //     history.push("/not_authorized");
  //   }
  // }, [user, history]);

  return (
    <div className="">
      {/* {user?.user.businessAccountName && (
        <div className="capitalize text-md font-bold text-[#707eae] mb-8">{`Hello ${user?.user?.businessAccountName}`}</div>
      )} */}
      <TopHeading mainHeading="Welcome to Camera Management" />
      <div className="gap-x-4 md:gap-x-0 md:w-full flex  justify-between my-4 items-center">
        <SearchBar
          placeholder="Search by Model , Title and ID"
          onSearch={handleSearch}
        />
        <Link
          className="w-[108px] h-[44px] flex justify-center items-center
           text-white gap-[5px] bg-primary-main rounded-lg"
          to={{
            pathname: "/camera_management/add",
          }}
        >
          Add +
        </Link>
      </div>
      <div className="overflow-x-auto w-full">
        <Table
          data={allCameras?.results || []}
          isLoading={allCamerasLoading}
          {...cameraTableConfig}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={allCameras?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CameraManagement;

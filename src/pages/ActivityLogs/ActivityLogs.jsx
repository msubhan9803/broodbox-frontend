import TopHeading from "components/TopHeading";
import Pagination from "components/table/Pagination";
import Table from "components/table/Table";
import { useActivityLogs } from "hooks/useActivityLogs";
import moment from "moment";
import { useState } from "react";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { activityLogsActions } from "utils/constants";
import { allRoles } from "utils/constants";

export default function ActivityLogs() {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const { data: allActivityLogs, isLoading } = useActivityLogs({
    search: searchQuery,
    sortBy: `${sort.field}:${sort.direction}`,
    page: currentPage,
    limit,
  });

  function formatTimestamp(timestamp) {
    // Parse the timestamp using Moment.js
    const date = moment(timestamp);

    // Format the date according to the desired format
    const formattedDate = date.format("MMMM D, YYYY hh:mmA");

    return formattedDate;
  }

  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === "asc";
    setSort({
      field,
      direction: isAsc ? "desc" : "asc",
    });
  };

  const handleDetails = (row) => {
    switch (row.action) {
      case activityLogsActions.farmCreated:
      case activityLogsActions.farmUpdated:
        history.push({
          pathname: `/farm_management/farm_detail/${row.actionObject.farmId}`,
          state: {
            businessAccountRef: row.actionObject.businessAccountRef,
          },
        });
        break;

      case activityLogsActions.beehiveCreated:
      case activityLogsActions.beeHiveUpdate:
        const { farmId, beehives, location_code } = row.actionObject;
        let { actionObject } = row;
        history.push({
          pathname: `/farm_management/edit_beehive_location/${farmId}/${location_code}`,
          state: {
            ...actionObject,
            farmId,
            beehives,
          },
        });
        break;

      case activityLogsActions.userCreated:
      case activityLogsActions.userUpdated:
      case activityLogsActions.user_added_to_farm:
      case activityLogsActions.userApproval:
      case activityLogsActions.userActivated:
      case activityLogsActions.userDeactivated:
      case activityLogsActions.farm_manager_assigned_to_farm:
        history.push({
          pathname: `/user_management/edit_user/${row.actionObject._id}`,
          state: {
            background: {
              pathname: "/activity_logs",
            },
          },
        });
        break;

      case activityLogsActions.cameraAdded:
        history.push({
          pathname: `/camera_management/view`,
          state: {
            ...row.actionObject.details,
          },
        });
        break;

      case activityLogsActions.trainingCreated:
        history.push({
          pathname: "/training/view",
          state: {
            item: { ...row.actionObject.details, index: 0 },
          },
        });
        break;
      default:
        break;
    }
  };

  const activityLogsTableConfig = {
    columns: [
      {
        headerName: "Action Performed By",
        field: "createdByUser.fullName",
        sortable: true,
        render: (data) => (
          <>
            {data.createdByUser.fullName && (
              <span className="flex items-center gap-2 font-bold">
                {data?.createdByUser?.fullName ||
                  data?.createdByUser?.firstName +
                    " " +
                    data?.createdByUser?.lastName}
              </span>
            )}
          </>
        ),
        renderSortIcon: () =>
          sort.field === "createdByUser.fullName" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("createdByUser.fullName"),
      },
      {
        headerName: "User Role",
        field: "createdByUser.role",
        sortable: true,
        render: (data) => (
          <p className="capitalize font-normal">
            {allRoles[data?.createdByUser?.role]}
          </p>
        ),
        renderSortIcon: () =>
          sort.field === "createdByUser.role" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("createdByUser.role"),
      },
      {
        headerName: "Action Performed",
        field: "action",
        sortable: true,
        render: (data) => (
          <>
            {data.createdByUser.fullName && (
              <>

              <span className="flex items-center gap-2 font-bold">
                {data?.action}
              </span>

              <span className="flex items-center gap-2">
                {data?.actionDetails}
              </span>
              </>
            )}
          </>
        ),
        renderSortIcon: () =>
          sort.field === "action" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("action"),
      },

      {
        headerName: "Date and time",
        field: "createdAt",
        sortable: true,
        render: (data) => (
          <>
            {data.createdByUser.fullName && (
              <span className="flex items-center gap-2 font-normal ">
                {formatTimestamp(data?.createdAt)}
              </span>
            )}
          </>
        ),
        renderSortIcon: () =>
          sort.field === "createdAt" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("createdAt"),
      },
    ],
    rowKey: "_id",
    actions: [
      {
        label: "Actions",
        render: (row) => (
          <button className="font-semibold" onClick={() => handleDetails(row)}>
            Details
          </button>
        ),
      },
    ],
  };

  return (
    <div className="font-extrabold">
      <TopHeading mainHeading={"Activity Logs"} />

      <div className="mt-5 overflow-x-auto w-full">
        <Table
          data={allActivityLogs?.results || []}
          isLoading={isLoading}
          {...activityLogsTableConfig}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={allActivityLogs?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import moment from "moment";
import TopHeading from "components/TopHeading";
import Table from "components/table/Table";
import SearchBar from "components/table/SearchBar";
import Pagination from "components/table/Pagination";
import { useAllFarms } from "hooks/useFarmManagement";
import { generateQueryString } from "utils/helper";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import { checkActionPrivilege } from "utils/helper";
import { modulesConfig, screenConfig, actionConfig } from "utils/constants";

const FarmManagement = () => {
  const { user } = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const moduleName = modulesConfig.farm_management;
  const screenName = screenConfig.farm_management;
  const { data: allFarmsData, isLoading: allFarmsLoading } = useAllFarms({
    search: searchQuery,
    sortBy: `${sort.field}:${sort.direction}`,
    page: currentPage,
    limit,
  });
  const { data: privilegedModulesData } = useGetPrivilegesByRoleName(
    user?.user?.role
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === "asc";
    setSort({
      field,
      direction: isAsc ? "desc" : "asc",
    });
  };

  const farmManagementTableConfig = {
    columns: [
      {
        headerName: "Farm ID",
        field: "farmId",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "farmId" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("farmId"),
      },
      {
        headerName: "Title",
        field: "title",
        sortable: true,
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
        headerName: "Business Account",
        field: "businessAccountRef.businessAccountName",
        render: (data) => data.businessAccountRef?.businessAccountName,
        sortable: true,
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
        headerName: "Created At",
        field: "createdAt",
        render: (data) => moment(data.createdAt).format("LL"),
        sortable: true,
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
      // checkActionPrivilege(
      //   moduleName,
      //   screenName,
      //   actionConfig.get_farm_detail,
      //   privilegedModulesData?.moduleList
      // ) && {
      //   label: "Generate",
      //   onClick: (row) => ({
      //     pathname: `/pollination_map/map_detail/${row.farmId}`,
      //     state: {
      //       businessAccountRef:
      //         allFarmsData?.results?.[0]?.businessAccountRef?._id,
      //     },
      //   }),
      // },
      checkActionPrivilege(
        moduleName,
        screenName,
        actionConfig.get_farm_detail,
        privilegedModulesData?.moduleList
      ) && {
        label: "View Map",
        onClick: (row) => ({
          pathname: `/pollination_map/map_detail/${row.farmId}`,
          state: {
            businessAccountRef:
              allFarmsData?.results?.[0]?.businessAccountRef?._id,
          },
        }),
      },
    ],
  };

  useEffect(() => {
    console.log(document.getElementsByClassName("selector4"));
  }, []);

  return (
    <>
      <TopHeading mainHeading={"Pollination Map"} />

      <div className="flex mt-[32px] gap-x-4 justify-between items-center">
        <SearchBar
          placeholder="Search by Farm Title or ID"
          onSearch={handleSearch}
        />
      </div>

      <div className="mt-5 overflow-x-auto w-full selector4">
        <Table
          data={allFarmsData?.results || []}
          isLoading={allFarmsLoading}
          {...farmManagementTableConfig}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={allFarmsData?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default FarmManagement;

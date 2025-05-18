import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "components/table/Table";
import SearchBar from "components/table/SearchBar";
import Select from "components/common/controls/Select";
import Pagination from "components/table/Pagination";
import Switch from "components/common/controls/Switch";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import UserOne from "images/user/user-01.png";
import {
  useToggleUserAccountStatus,
  useToggleUserEmailVerification,
} from "hooks/useUser";
import useUserListByScreenContext from "hooks/useUserListByScreenContext";
import {
  allRoles,
  accountStatusTypes,
  roleTypes,
  userManagementComponentContextTypes,
} from "utils/constants";
import { generateQueryString } from "utils/helper";
import {
  AccountUpdatedSuccessfully,
  Active,
  Deactive,
  Verified,
  Unverified,
} from "utils/message";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import { checkActionPrivilege } from "utils/helper";
import { modulesConfig, screenConfig, actionConfig } from "utils/constants";

const UserManagement = ({ farmId, context }) => {
  const [selectedRole, setSelectedRole] = useState(null); // State for the selected role
  const [selectedAccountStatus, setSelectedAccountStatus] = useState(null); // State for the selected role
  const { user } = useSelector((state) => state.user);
  const currentUserRole = user?.user?.role;
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const moduleName = modulesConfig.user_management;
  const screenName = screenConfig.user_management;

  const { data: allUsersData, isLoading: allUsersLoading } =
    useUserListByScreenContext({
      context,
      farmId,
      role: selectedRole || "",
      accountStatus: selectedAccountStatus,
      search: searchQuery,
      sortBy: `${sort.field}:${sort.direction}`,
      page: currentPage,
      limit,
    });
  const { data: privilegedModulesData } = useGetPrivilegesByRoleName(
    user?.user?.role
  );
  const {
    mutate: toggleUserAccountStatusMutation,
    isLoading: toggleUserAccountStatusLoading,
  } = useToggleUserAccountStatus();

  const {
    mutate: toggleUserEmailVerificationData,
    isLoading: toggleUserEmailVerificationLoading,
  } = useToggleUserEmailVerification();

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

  const handleUserAccountStatusToggle = (userId) => {
    toggleUserAccountStatusMutation(userId, {
      onSuccess: () => {
        toast.success(AccountUpdatedSuccessfully);
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });
  };

  const handleUserEmailVerificationToggle = (userId) => {
    toggleUserEmailVerificationData(userId, {
      onSuccess: () => {
        toast.success(AccountUpdatedSuccessfully);
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });
  };

  const userManagementTableConfig = {
    columns: [
      {
        headerName: "Role",
        field: "role",
        sortable: true,
        render: (data) => (
          <>
            {data.role && (
              <span className="flex items-center gap-2 font-bold">
                {allRoles[data.role]}
              </span>
            )}
          </>
        ),
        renderSortIcon: () =>
          sort.field === "role" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("role"),
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "email" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("email"),
      },
      [roleTypes.superAdmin].includes(currentUserRole) &&
        context !== userManagementComponentContextTypes.farm_detail && {
          headerName: "Business Account Name",
          field: "data.businessAccountName",
          render: (data) => (
            <>
              <span className="flex items-center gap-2 flex-wrap">
                {/* {data?.businessAccountRefDetails?.businessAccountName ||
                data.businessAccountName ? (
                  <img
                    className="inline-block size-8  border border-gray-300 rounded-full"
                    src={
                      data?.profileImageUrl ||
                      `${process.env.REACT_APP_BASE_URL}/v1/S3/getMedia/profile_Image.jpg`
                    }
                    alt="User"
                  />
                ) : (
                  ""
                )} */}

                {data?.contractorBusinessAccountRefsDetails
                  ?.map((elem) => elem.businessAccountName)
                  .join(", ") ||
                  data?.businessAccountRefDetails?.businessAccountName ||
                  data.businessAccountName}
              </span>
            </>
          ),
          sortable: true,
          renderSortIcon: () =>
            sort.field === "businessAccountName" &&
            (sort.direction === "asc" ? (
              <HiMiniChevronUp className="text-lg" />
            ) : (
              <HiMiniChevronDown className="text-lg" />
            )),
          onClick: () => handleSortChange("businessAccountName"),
        },
      {
        headerName: "User's Name",
        field: "fullName",
        render: (data) => (
          <>
            <span className="flex items-center gap-2">
              {data.fullName || data.firstName ? (
                <img
                  className="inline-block size-8 rounded-full border border-gray-300 "
                  src={
                    data?.profileImageUrl ||
                    `${process.env.REACT_APP_BASE_URL}/v1/S3/getMedia/profile_Image.jpg`
                  }
                  alt="User"
                />
              ) : (
                ""
              )}

              {data.fullName ||
                (data.firstName && data.firstName + " " + data.lastName) ||
                ""}
            </span>
          </>
        ),
        sortable: true,
        renderSortIcon: () =>
          sort.field === "fullName" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("fullName"),
      },
      // {
      //   headerName: "Created At",
      //   field: "createdAt",
      //   render: (data) => moment(data.createdAt).format("LL"),
      //   sortable: true,
      //   renderSortIcon: () =>
      //     sort.field === "createdAt" &&
      //     (sort.direction === "asc" ? (
      //       <HiMiniChevronUp className="text-lg" />
      //     ) : (
      //       <HiMiniChevronDown className="text-lg" />
      //     )),
      //   onClick: () => handleSortChange("createdAt"),
      // },
      {
        headerName: "Activate/Deactivate",
        render: (row) =>
          checkActionPrivilege(
            moduleName,
            screenName,
            actionConfig.manage_users,
            privilegedModulesData?.moduleList
          ) && (
            <span className="flex items-center gap-2 ">
              <Switch
                checked={row.isApproved}
                onChange={() => handleUserAccountStatusToggle(row._id)}
                disabled={toggleUserAccountStatusLoading}
                id={`account-status-switch-${row._id}`}
              />
              {row.isApproved ? Active : Deactive}
            </span>
          ),
        sortable: true,
        renderSortIcon: () =>
          sort.field === "isApproved" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("isApproved"),
      },
    ],
    rowKey: "_id",
    actions: [
      checkActionPrivilege(
        moduleName,
        screenName,
        actionConfig.manage_users,
        privilegedModulesData?.moduleList
      ) && {
        label: "Manage User",
        onClick: (row) => ({
          pathname: `/user_management/edit_user/${row._id}`,
          search: farmId ? `?${generateQueryString(farmId)}` : "",
          state: { background: location },
        }),
      },
      // checkActionPrivilege(
      //   moduleName,
      //   screenName,
      //   actionConfig.manage_users,
      //   privilegedModulesData?.moduleList
      // ) && {
      //   label: "Approval Status",
      //   render: (row) => (
      //     <span className="flex items-center gap-2">
      //       <Switch
      //         checked={row.isApproved}
      //         onChange={() => handleUserAccountStatusToggle(row._id)}
      //         disabled={toggleUserAccountStatusLoading}
      //         id={`account-status-switch-${row._id}`}
      //       />

      //       {row.isApproved ? Active : Deactive}
      //     </span>
      //   ),
      // },
      // checkActionPrivilege(
      //   moduleName,
      //   screenName,
      //   actionConfig.manage_users,
      //   privilegedModulesData?.moduleList
      // ) && {
      //   label: "Email Verification",
      //   render: (row) => (
      //     <span className="flex items-center gap-2">
      //       <Switch
      //         checked={row.isEmailVerified}
      //         onChange={() => handleUserEmailVerificationToggle(row._id)}
      //         disabled={toggleUserEmailVerificationLoading}
      //         id={`email-switch-${row._id}`}
      //       />

      //       {row.isEmailVerified ? Verified : Unverified}
      //     </span>
      //   ),
      // },
    ],
  };

  // Removed this logic: All it was doing to bring farmManager at the top
  // const sortedResults =
  //   allUsersData?.results.sort((a, b) => {
  //     if (a.role === "farmManager" && b.role !== "farmManager") {
  //       return -1;
  //     }
  //     if (b.role === "farmManager" && a.role !== "farmManager") {
  //       return 1;
  //     }
  //     return 0;
  //   }) || [];

  // Update the sortedResults to filter based on selectedRole
  const filteredResults = selectedRole
    ? allUsersData?.results.filter((result) => result.role === selectedRole)
    : allUsersData?.results;

  return (
    <>
      <div className="flex justify-between items-center mt-8 gap-y-2 lg:gap-y-0 gap-x-4 flex-wrap">
        <SearchBar
          placeholder="Search by Name, Business name or Email"
          onSearch={handleSearch}
        />

        <div className="flex gap-x-2 items-center flex-wrap gap-y-2 lg:gap-y-0">
          {context !== userManagementComponentContextTypes.farm_detail && (
            <>
              <div className="max-w-52">
                <Select
                  bgColor="bg-white"
                  options={[
                    { label: "All (unarchived)", value: "" }, // Added "All" option
                    ...Object.keys(accountStatusTypes).map((key) => ({
                      label: accountStatusTypes[key],
                      value: key,
                    })),
                  ]}
                  value={selectedAccountStatus}
                  onChange={(value) => {
                    setSelectedAccountStatus(value);
                  }}
                  placeholder="Filter By Account Status"
                />
              </div>

              <div className="max-w-52">
                <Select
                  bgColor="bg-white"
                  options={[
                    { label: "All Roles", value: "" }, // Added "All" option
                    ...Object.keys(allRoles).map((key) => ({
                      label: allRoles[key],
                      value: key,
                    })),
                  ]}
                  value={selectedRole}
                  onChange={(value) => {
                    setSelectedRole(value);
                  }}
                  placeholder="Filter By Role"
                />
              </div>
            </>
          )}

          {checkActionPrivilege(
            moduleName,
            screenName,
            actionConfig.manage_users,
            privilegedModulesData?.moduleList
          ) && (
            <Link
              className="w-[108px] h-[44px] flex justify-center items-center text-white gap-[5px] bg-primary-main rounded-lg "
              to={{
                pathname: "/user_management/add_user",
                search: farmId ? `?${generateQueryString(farmId)}` : "",
                state: { background: location },
              }}
            >
              Add User +
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto w-full selector6">
        <Table
          data={filteredResults || []}
          isLoading={allUsersLoading}
          {...userManagementTableConfig}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={allUsersData?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default UserManagement;

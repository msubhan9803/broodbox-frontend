import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Table from "components/table/Table";
import { useAllRoles } from "hooks/useUserManagement";
import { allRoles } from "utils/constants";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import { checkActionPrivilege } from "utils/helper";
import { modulesConfig, screenConfig, actionConfig } from "utils/constants";

const RolesManagement = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const moduleName = modulesConfig.user_management;
  const screenName = screenConfig.user_management;
  const { data: allRolesData, isLoading: allRolesLoading } = useAllRoles();
  const { data: privilegedModulesData } = useGetPrivilegesByRoleName(
    user?.user?.role
  );

  const rolesManagementTableConfig = {
    columns: [
      {
        headerName: "Role name",
        field: "role",
        sortable: false,
        render: (data) => (
          <>
            {data.role && (
              <span className="flex items-center gap-2 font-bold">
                {allRoles[data.role]}
              </span>
            )}
          </>
        ),
      },
      {
        headerName: "Modified on",
        field: "updatedAt",
        render: (data) => moment(data.updatedAt).format("LL"),
        sortable: false,
      },
    ],
    rowKey: "_id",
    actions: [
      checkActionPrivilege(
        moduleName,
        screenName,
        actionConfig.manage_roles,
        privilegedModulesData?.moduleList
      ) && {
        label: "Manage Privileges",
        onClick: (row) => ({
          pathname: `/user_management/edit_role/${row.role}`,
          state: { background: location },
        }),
      },
    ],
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table
        data={allRolesData || []}
        isLoading={allRolesLoading}
        {...rolesManagementTableConfig}
      />
    </div>
  );
};

export default RolesManagement;

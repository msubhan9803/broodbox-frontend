import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Map from "components/Map";
import BeeHiveLocation from "components/farmManagement/BeeHiveLocation";
import { useFarmById } from "hooks/useFarmManagement";
import Loader from "components/common/Loader";
import BackButton from "components/common/Buttons/BackButton";
import UserManagement from "components/userManagement/UserManagement";
import TopHeading from "components/TopHeading";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import { checkActionPrivilege } from "utils/helper";
import {
  userManagementComponentContextTypes,
  modulesConfig,
  screenConfig,
  actionConfig,
  routeContextType,
  mapContext,
} from "utils/constants";

const ManageUser = () => {
  const { user } = useSelector((state) => state.user);
  const [beehives, setBeeHives] = useState([]);
  const history = useHistory();
  const { farmId } = useParams();
  const moduleName = modulesConfig.farm_management;
  const screenName = screenConfig.manage_user;
  const { data: farmDetailData, isLoading: farmDetailLoading } =
    useFarmById(farmId);
  const { data: privilegedModulesData } = useGetPrivilegesByRoleName(
    user?.user?.role
  );

  const mapPermissions = {
    isScrollwheelEnabled: false,
    isEditable: false,
    isFarmBoundaryEditable: false,
    isBeehiveLocationEditable: false,
  };

  const handleRedirectToEditFarm = (id) => {
    history.push({
      pathname: `/farm_management/edit_farm/${id}`,
    });
  };

  if (farmDetailLoading) return <Loader />;

  return (
    <div className="w-full">
      <BackButton />
      <TopHeading mainHeading={"Manage Farm Users"} />

      <div className="mt-8 flex flex-col gap-y-6 lg:gap-y-0 lg:gap-x-4 lg:flex-row lg:justify-between lg:items-center pb-4 my-4">
        <TopHeading
          subHeading={
            farmDetailData?.farm?.businessAccountRef?.businessAccountName
          }
          mainHeading={`${farmDetailData?.farm?.farmId} - ${farmDetailData?.farm?.title}`}
          primaryTextColor="text-primary-dark"
        />
      </div>

      <div className="border bg-white border-light drop-shadow-md rounded-md p-4">
        <Map
          context={mapContext.farm_detail}
          beehiveData={beehives}
          boundaries={farmDetailData?.boundaries}
          permissions={mapPermissions}
        />
      </div>

      {checkActionPrivilege(
        moduleName,
        screenName,
        actionConfig.manage_users,
        privilegedModulesData?.moduleList
      ) && (
        <div className="my-10">
          <h1 className="text-3xl font-bold text-gray-dark">User management</h1>

          <UserManagement
            farmId={farmId}
            context={userManagementComponentContextTypes.farm_detail}
          />
        </div>
      )}
    </div>
  );
};

export default ManageUser;

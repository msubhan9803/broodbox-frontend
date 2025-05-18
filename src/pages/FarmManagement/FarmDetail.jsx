import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import Map from "components/Map";
import BeeHiveLocation from "components/farmManagement/BeeHiveLocation";
import { useFarmById, useDeleteFarm } from "hooks/useFarmManagement";
import Loader from "components/common/Loader";
import BackButton from "components/common/Buttons/BackButton";
import TopHeading from "components/TopHeading";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import { checkActionPrivilege } from "utils/helper";
import {
  modulesConfig,
  screenConfig,
  actionConfig,
  mapContext,
} from "utils/constants";

const DetailsFarmManagement = () => {
  const { user } = useSelector((state) => state.user);
  const history = useHistory();
  const { farmId } = useParams();
  const moduleName = modulesConfig.farm_management;
  const screenName = screenConfig.farm_detail;
  const { data: farmDetailData, isLoading: farmDetailLoading } =
    useFarmById(farmId);
  const { data: privilegedModulesData } = useGetPrivilegesByRoleName(
    user?.user?.role
  );
  const { mutate: deleteFarmMutation, isLoading: deleteFarmMutationLoading } =
    useDeleteFarm();

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

  const handleDeleteFarm = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this farm?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFarmMutation(id, {
          onSuccess: () => {
            toast.success("Farm deleted");
            history.push("/farm_management");
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "An error occurred.");
          },
        });
      }
    });
  };

  if (farmDetailLoading) return <Loader />;

  return (
    <div className="w-full">
      <BackButton />
      <TopHeading mainHeading={"Farm Detail"} />

      <div className="mt-8 flex flex-col gap-y-6 lg:gap-y-0 lg:gap-x-4 lg:flex-row lg:justify-between lg:items-center pb-4 my-4">
        <TopHeading
          subHeading={
            farmDetailData?.farm?.businessAccountRef?.businessAccountName
          }
          mainHeading={`${farmDetailData?.farm?.farmId} - ${farmDetailData?.farm?.title}`}
          primaryTextColor="text-primary-dark"
        />

        <div className="flex gap-3">
          {checkActionPrivilege(
            moduleName,
            screenName,
            actionConfig.edit_farm,
            privilegedModulesData?.moduleList
          ) && (
            <button
              onClick={() => handleRedirectToEditFarm(farmId)}
              className="w-[108px] h-[40px] flex justify-center items-center text-white gap-[5px] bg-primary-main rounded-lg"
            >
              Edit +
            </button>
          )}

          {checkActionPrivilege(
            moduleName,
            screenName,
            actionConfig.delete_farm,
            privilegedModulesData?.moduleList
          ) && (
            <button
              onClick={() => handleDeleteFarm(farmId)}
              className="w-[108px] h-[40px] flex justify-center items-center text-gray-500 border border-gray-400 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 font-bold rounded-lg"
              disabled={deleteFarmMutationLoading}
            >
              {deleteFarmMutationLoading ? <ButtonSpinner /> : "Delete"}
            </button>
          )}
        </div>
      </div>

      <div className="border bg-white border-light drop-shadow-md rounded-md p-4">
        <Map
          context={mapContext.farm_detail}
          beehiveData={farmDetailData?.beehiveLocations}
          boundaries={farmDetailData?.boundaries}
          permissions={mapPermissions}
        />
      </div>

      {/* {checkActionPrivilege(
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
      )} */}

      {checkActionPrivilege(
        moduleName,
        screenName,
        actionConfig.manage_beehive_locations,
        privilegedModulesData?.moduleList
      ) && (
        <div className="my-10">
          <h1 className="text-3xl font-bold text-gray-dark">
            Bee Hive Locations
          </h1>

          <BeeHiveLocation businessAccountRef={farmDetailData} />
        </div>
      )}
    </div>
  );
};

export default DetailsFarmManagement;

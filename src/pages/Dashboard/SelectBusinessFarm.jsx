import React, { useContext, useEffect } from "react";
import ComboBox from "components/common/controls/ComboBox";
import { DashboardContext } from "pages/Dashboard/DashboardContext";
import { useBusinessAccounts } from "hooks/useUser";
import { useFarmsByBusinessAccountRef } from "hooks/useFarmManagement";
import { useSelector } from "react-redux";
import { roleTypes } from "utils/constants";
import { useGetAllFramesByFarmId } from "hooks/useFarmManagement";

const ComboBoxes = () => {
  const { user } = useSelector((state) => state.user);
  const currentUserRole = user?.user?.role;

  const empty = {
    area_code: [],
    total_active_frames: [],
  };

  // Use DashboardContext for managing business account and farm references
  const {
    setFarmId,
    farmId,
    setBusinessAccountRef,
    businessAccountRef,
    totalActiveFrames,
    setTotalActiveFrames,
  } = useContext(DashboardContext);

  const { data: framesData, isLoading: framesLoading } =
    useGetAllFramesByFarmId({ businessAccountRef, farmId });

  const { data: businessAccountsData, isLoading: businessAccountsLoading } =
    useBusinessAccounts(true);

  const { data: farmsData, isLoading: farmsLoading } =
    useFarmsByBusinessAccountRef(businessAccountRef);

  // Transforming business accounts and farms data to ComboBox options
  const businessAccountOptions =
    businessAccountsData?.map((account) => ({
      value: account._id,
      label: account.businessAccountName,
    })) || [];

  const farmOptions =
    farmsData?.map((farm) => ({
      value: farm.farmId,
      label: `${farm.farmId}`,
    })) || [];

  useEffect(() => {
    // Reset farm reference in context when business account changes
    setFarmId("");
  }, [businessAccountRef, setFarmId]);

  useEffect(() => {
    if (currentUserRole === roleTypes.businessAccount) {
      setBusinessAccountRef(user?.user._id);
    }
  }, [currentUserRole, user]);

  useEffect(() => {
    if (!framesData?.error && framesData) {
      setTotalActiveFrames(framesData);
    } else {
      setTotalActiveFrames(empty);
    }
  }, [framesData, farmId]);

  useEffect(() => {
    if (
      currentUserRole !== roleTypes.businessAccount &&
      businessAccountsData &&
      businessAccountsData.length > 0
    ) {
      setBusinessAccountRef(businessAccountsData[0]._id);
    }
  }, [businessAccountsData, currentUserRole]);

  useEffect(() => {
    if (farmsData && farmsData.length > 0) {
      setFarmId(farmsData[0].farmId);
    }
  }, [farmsData, currentUserRole]);

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 selector3">
      {/* Business Account ComboBox */}
      {currentUserRole !== roleTypes.businessAccount && (
        <div className="w-full md:min-w-96">
          <label
            htmlFor="businessAccountRef"
            className="block text-sm font-medium mb-1 dark:text-white"
          >
            Business Account
          </label>
          <div className="lg:min-w-96">
            <ComboBox
              id="businessAccountRef"
              value={businessAccountRef}
              onChange={setBusinessAccountRef}
              placeholder="Select business account"
              options={businessAccountOptions}
              loading={businessAccountsLoading}
              disabled={
                businessAccountsLoading ||
                [roleTypes.user, roleTypes.farmManager].includes(
                  currentUserRole
                )
              }
            />
          </div>
        </div>
      )}

      <div className="w-full">
        <label
          htmlFor="assignedToFarm"
          className="block text-sm font-medium mb-1 dark:text-white"
        >
          Farm
        </label>
        <ComboBox
          id="assignedToFarm"
          value={farmId}
          onChange={setFarmId}
          placeholder="Select farm"
          options={farmOptions}
          loading={farmsLoading}
          disabled={
            farmsLoading ||
            [roleTypes.user, roleTypes.farmManager].includes(currentUserRole)
          }
        />
      </div>
    </div>
  );
};

export default ComboBoxes;

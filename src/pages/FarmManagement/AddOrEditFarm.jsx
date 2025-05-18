import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory, useParams, Prompt } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "components/common/Loader";
import Input from "components/common/controls/Input";
import ComboBox from "components/common/controls/ComboBox";
import Map from "components/Map";
import TopHeading from "components/TopHeading";
import BackButton from "components/common/Buttons/BackButton";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import {
  useUniqueFarmId,
  useFarmById,
  useCreateFarm,
  useCanCreateMapCheck,
  useUpdateFarm,
} from "hooks/useFarmManagement";
import { useBusinessAccounts } from "hooks/useUser";
import { activityLogsActions, roleTypes } from "utils/constants";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const schema = yup
  .object({
    title: yup.string().required("Farm title is required"),
    businessAccountRef: yup.string().required("Business Account is required"),
    boundaries: yup.array().min(1, "Please select boundaries"),
  })
  .required();

export default function AddOrEditFarm() {
  const location = useLocation();
  const { farmId } = useParams();
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const currentUserRole = user?.user?.role;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);
  const { data: uniqueFarmId } = useUniqueFarmId();
  const { data: farmDetailData, isLoading: farmDetailLoading } =
    useFarmById(farmId);
  const { data: businessAccountsData, isLoading: businessAccountsLoading } =
    useBusinessAccounts(user?.user?.role === roleTypes.superAdmin);

  const createFarmMutation = useCreateFarm();
  const canCreateMapCheck = useCanCreateMapCheck();
  const updateFarmMutation = useUpdateFarm();

  const initialFormState = {
    title: "",
    businessAccountRef: "",
    boundaries: [],
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialFormState,
  });
  const boundaries = watch("boundaries");

  const mapPermissions = {
    isScrollwheelEnabled: true,
    isEditable: true,
    isFarmBoundaryEditable: true,
    isBeehiveLocationEditable: false,
  };

  const onSubmit = async (formData) => {
    setIsFormLoading(true);

    const params = {
      ...formData,
      farmId: farmId ? farmId : formData.id,
    };

    const onSuccess = (data) => {
      setShouldBlockNavigation(false);
      reset(initialFormState);

      toast.success(
        farmId
          ? "Successfully updated the farm."
          : "Successfully created a new farm."
      );
      setIsFormLoading(false);
      history.goBack();
    };

    const onError = (error) => {
      toast.error(error.response?.data?.message || "An error occurred.");
      setIsFormLoading(false);
    };

    const temp = {
      latitudeList: formData.boundaries.map((elem) => elem.lat).join(","),
      longitudeList: formData.boundaries.map((elem) => elem.lng).join(","),
    };

    canCreateMapCheck.mutate(temp, {
      onSuccess: (data) => {
        if (data.result) {
          if (farmId) {
            updateFarmMutation.mutate(params, { onSuccess, onError });
          } else {
            createFarmMutation.mutate(params, { onSuccess, onError });
          }
        } else {
          toast.error(data?.data?.message || "Boundary is not appropriate");
          setIsFormLoading(false);
        }
      },
      onError: () => {
        toast.error("Unable to check Farm creation");
        setIsFormLoading(false);
      }
    });
  };

  useEffect(() => {
    setShouldBlockNavigation(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (uniqueFarmId) {
      setValue("id", uniqueFarmId.farmId);
    }
  }, [uniqueFarmId, setValue]);

  useEffect(() => {
    if (farmDetailData) {
      const { farm, boundaries } = farmDetailData;
      setValue("title", farm.title);
      setValue("boundaries", boundaries);
      setValue("businessAccountRef", farm.businessAccountRef._id);
    }
  }, [farmDetailData, setValue]);

  useEffect(() => {
    if (currentUserRole === roleTypes.businessAccount) {
      setValue("businessAccountRef", user?.user._id);
    }
  }, [currentUserRole, user]);

  if (farmDetailLoading) return <Loader />;

  return (
    <>
      <Prompt
        when={shouldBlockNavigation}
        message="Are you sure you want to leave?"
      />

      <div className="w-full min-h-screen lg:px-4">
        <BackButton />
        <TopHeading mainHeading={farmId ? "Edit Farm" : "Create Farm"} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full bg-white rounded-md border border-light drop-shadow-md mt-[38px] divide-y-[1px] divide-gray-200">
            {/* Business Account Details */}
            <div className="px-6 py-8">
              <h1 className="text-gray-900 text-base font-bold">
                Business Account details
              </h1>

              <div className="flex gap-y-4 flex-col w-full lg:w-[40%] max-w-lg">
                <div className="my-2">
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    Business Account <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="businessAccountRef"
                    render={({ field }) => (
                      <ComboBox
                        {...field}
                        onChange={(id) => field.onChange(id)}
                        value={field.value}
                        placeholder="Select business account"
                        disabled={
                          currentUserRole === roleTypes.businessAccount ||
                          Boolean(farmId) ||
                          isFormLoading
                        }
                        options={
                          businessAccountsData?.map((account) => ({
                            value: account._id,
                            label: account.businessAccountName,
                          })) || []
                        }
                        loading={businessAccountsLoading}
                        error={errors.businessAccountRef}
                        searchBy="label"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="px-6 py-8">
              <h1 className="text-gray-900 text-base font-bold">
                Farm details
              </h1>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-x-20">
                <div className="my-2 w-full lg:w-auto max-w-lg lg:flex-1">
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    Farm Title <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Farm Title"
                        disabled={isFormLoading}
                        error={errors.title}
                      />
                    )}
                  />
                </div>

                <div className="my-2">
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    Farm ID <span className="text-red-500">*</span>
                  </label>

                  <Controller
                    control={control}
                    name="id"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled
                        className="w-auto p-2 bg-gray-light-2 px-4 outline-none border border-[#E5ECF8] rounded-lg"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Map for Selecting Boundaries */}
            <div className="px-6 py-8">
              <Map
                boundaries={boundaries}
                setBoundaries={(newBoundaries) =>
                  setValue("boundaries", newBoundaries)
                }
                permissions={mapPermissions}
                handleClearBoundaries={() => setValue("boundaries", [])}
              />
              {errors.boundaries && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.boundaries.message}
                </p>
              )}
            </div>

            <div className="px-6 py-8 flex justify-end gap-x-4">
              <button
                type="button"
                className="text-slate-500 w-[153px] h-[46px] rounded-lg"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-main disabled:bg-primary-light text-white w-[153px] h-[46px] rounded-lg flex justify-center items-center"
                disabled={isFormLoading}
              >
                {isFormLoading ? <ButtonSpinner /> : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

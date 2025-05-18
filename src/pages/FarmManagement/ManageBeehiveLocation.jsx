import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory, useParams, Prompt } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "components/common/Loader";
import ComboBox from "components/common/controls/ComboBox";
import ComboBox2 from "components/common/controls/ComboBox2";
import Input from "components/common/controls/Input";
import Select from "components/common/controls/Select";
import PhoneNumberInput from "components/common/controls/PhoneNumber";
import Map from "components/Map";
import TopHeading from "components/TopHeading";
import BackButton from "components/common/Buttons/BackButton";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import {
  useUniqueFarmId,
  useFarmById,
  useCreateFarm,
  useUpdateHive,
  useAddBeeHive,
  useGetAllAreaLocationCodes,
} from "hooks/useFarmManagement";
import { useBusinessAccounts } from "hooks/useUser";
import {
  roleTypes,
  controlTypes,
  routeContextType,
  mapContext,
} from "utils/constants";
// import { locationCodes, allAreaAndLocationCodes } from "utils/FakeData";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const schema = yup
  .object({
    latitude: yup.string().required("Latitude is required"),
    longitude: yup.string().required("Latitude is required"),
    area_code: yup.string().required("Area code is required"),
    location_code: yup.string().required("Location code is required"),
    total_beehives: yup.string().required("Total beehives is required"),
  })
  .required();

export default function ManageBeehiveLocation({ context }) {
  const { farmId, areaCode, locationCode } = useParams();
  const history = useHistory();
  const location = useLocation();
  // const { beehives } = location.state;
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
  const updateFarmMutation = useUpdateHive();
  const useAddBeeHiveMutation = useAddBeeHive();
  console.log("location", location);
  const initialFormState =
    context === routeContextType.edit
      ? {
          latitude: location.state.latitude,
          longitude: location.state.longitude,
          area_code: location.state.area_code,
          location_code: location.state.location_code,
          total_beehives: location.state.total_beehives,
          img_urls: location.state.img_urls,
        }
      : {
          latitude: "",
          longitude: "",
          area_code: "",
          location_code: "",
          total_beehives: "",
          img_urls: "[]",
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
  const allFormValues = watch();
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const mapPermissions = {
    isScrollwheelEnabled: true,
    isEditable: true,
    isFarmBoundaryEditable: false,
    isBeehiveLocationEditable: true,
  };

  const params = {
    farmId,
    businessAccRef: farmDetailData?.farm?.businessAccountRef?._id,
  };
  const { data: allAreaAndLocationCodes } = useGetAllAreaLocationCodes(params);
  const formFieldsConfig = () => [
    {
      name: "latitude",
      label: "Latitude",
      isRequired: true,
      type: controlTypes.input,
      placeholder: "Latitude",
      isVisible: true,
      isDisabled: true,
      className: "col-span-3 md:col-span-1",
    },
    {
      name: "longitude",
      label: "Longitude",
      isRequired: true,
      type: controlTypes.input,
      placeholder: "Longitude",
      isVisible: true,
      isDisabled: true,
      className: "col-span-3 md:col-span-1",
    },
    {
      name: "area_code",
      label: "Area code",
      isRequired: true,
      type: controlTypes.comboBox2,
      options:
        allAreaAndLocationCodes?.hive_details
          ?.map((code) => ({
            value: code.area_code,
            label: code.area_code,
          }))
          .concat(
            allFormValues.area_code
              ? [
                  {
                    value: allFormValues.area_code,
                    label: allFormValues.area_code,
                  },
                ]
              : []
          ) || [],
      placeholder: "Select Area code",
      isVisible: true,
      isDisabled: context === routeContextType.edit,
      className: "col-span-3 md:col-span-1",
    },
    {
      name: "location_code",
      label: "Location code",
      isRequired: true,
      type: controlTypes.comboBox2,
      options:
        allAreaAndLocationCodes?.hive_details
          ?.map((code) => ({
            value: code.location_code,
            label: code.location_code,
          }))
          .concat(
            allFormValues.location_code
              ? [
                  {
                    value: allFormValues.location_code,
                    label: allFormValues.location_code,
                  },
                ]
              : []
          ) || [],
      placeholder: "Select Location code",
      isVisible: true,
      isDisabled: context === routeContextType.edit,
      className: "col-span-3 md:col-span-1",
    },
    {
      name: "total_beehives",
      label: "Total Beehives",
      isRequired: true,
      type: controlTypes.input,
      placeholder: "Total Beehives",
      isVisible: true,
      isDisabled: isFormLoading,
      className: "col-span-3 md:col-span-1",
    },
  ];

  const getControlComponentByType = (type) => {
    switch (type) {
      case controlTypes.select:
        return Select;

      case controlTypes.comboBox:
        return ComboBox;

      case controlTypes.comboBox2:
        return ComboBox2;

      case controlTypes.input:
        return Input;

      case controlTypes.phoneNumberInput:
        return PhoneNumberInput;

      default:
        return Input;
    }
  };

  const onSubmit = async (formData) => {
    setIsFormLoading(true);

    const params = {
      ...formData,
      farmId: farmId ? farmId : formData.id,
      ...(context === routeContextType.edit && {
        img_urls: location.state.img_urls === null && "[]",
        ac: location.state.area_code,
        lc: location.state.location_code,
      }),
    };

    const onSuccess = () => {
      setShouldBlockNavigation(false);
      reset(initialFormState);

      setIsFormLoading(false);
      if (context === routeContextType.edit) {
        toast.success("Successfully updated beehive location");
      } else {
        toast.success("Successfully added beehive location");
      }
      history.goBack();
    };

    const onError = (error) => {
      if (context === routeContextType.edit) {
        toast.success("Successfully updated beehive location");
      } else {
        toast.success("Successfully added beehive location");
      }
      setIsFormLoading(false);
    };

    if (context === routeContextType.edit) {
      // If editing, use updateFarmMutation
      updateFarmMutation.mutate(params, { onSuccess, onError });
    } else {
      // If adding, use useAddBeeHiveMutation
      useAddBeeHiveMutation.mutate(params, { onSuccess, onError });
    }

    // onSuccess();
  };

  const handleBeehiveLocation = (boundary) => {
    setValue("latitude", boundary.lat);
    setValue("longitude", boundary.lng);
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

  if (farmDetailLoading) return <Loader />;

  const filteredData = farmDetailData?.beehiveLocations?.filter(
    ({ latitude, longitude }) =>
      longitude !== initialFormState.longitude ||
      latitude !== initialFormState.latitude
  );

  return (
    <>
      <Prompt
        when={shouldBlockNavigation}
        message="Are you sure you want to leave?"
      />

      <BackButton />
      <TopHeading
        mainHeading={
          context === routeContextType.add
            ? "Add Beehive Location"
            : "Edit Beehive Location"
        }
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full bg-white rounded-md border border-light drop-shadow-md mt-[38px] divide-y-[1px] divide-gray-200">
          <div className="px-6 py-8">
            <h1 className="text-gray-900 text-lg font-bold pb-4">
              Select Beehive Location
            </h1>

            <Map
              context={mapContext.beeHive_Management}
              beehiveData={filteredData}
              isDefaultIcon={true}
              beehiveLocationCoord={{
                lat: latitude,
                lng: longitude,
              }}
              handleBeehiveLocation={handleBeehiveLocation}
              boundaries={farmDetailData?.boundaries}
              setBoundaries={(newBoundaries) =>
                console.log("newBoundaries: ", newBoundaries)
              }
              permissions={mapPermissions}
              handleClearBoundaries={() => console.log("........ || ........")}
            />
            {errors.boundaries && (
              <p className="text-sm text-red-600 mt-2">
                {errors.boundaries.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 px-6 py-8">
            {formFieldsConfig().map((field, index) => {
              if (!field.isVisible) return null;

              const FieldComponent = getControlComponentByType(field.type);

              return (
                <div className={field.className}>
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    {field.label}&nbsp;
                    {field.isRequired && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>

                  <Controller
                    key={index}
                    name={field.name}
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, name },
                      fieldState: { error },
                    }) => (
                      <FieldComponent
                        type={field?.inputType}
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        error={error}
                        options={field?.options}
                        placeholder={field?.placeholder}
                        disabled={field.isDisabled || isFormLoading}
                        loading={field?.isLoading}
                      />
                    )}
                  />
                </div>
              );
            })}
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
    </>
  );
}

import { yupResolver } from "@hookform/resolvers/yup";
import TopHeading from "components/TopHeading";
import BackButton from "components/common/Buttons/BackButton";
import Input from "components/common/controls/Input";
import * as yup from "yup";
import { roleTypes } from "utils/constants";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import ComboBox from "components/common/controls/ComboBox";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useBusinessAccounts } from "hooks/useUser";
import { useCreateCamera, useUniqueCameraId } from "hooks/useCamera";
import { useFarmsByBusinessAccountRef } from "hooks/useFarmManagement";
import Select from "components/common/controls/Select";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "components/common/controls/CustomDatePicker";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { toast } from "react-toastify";
import moment from "moment";

const AddCamera = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [returnDate, setReturnDate] = useState("");

  const currentUserRole = user?.user?.role;

  const initialFormState = {
    cameraId: "",
    title: "",
    model: "",
    businessAccountRef: "",
    assignedToFarm: "",
    status: "",
    assignmentTerm: "",
    lendDate: null,
  };
  const schema = yup
    .object({
      title: yup.string().required("Title is required"),
      model: yup.string().required("Model is required"),
      businessAccountRef: yup.string(),
      assignedToFarm: yup.string(),
      cameraId: yup.string(),
      lendDate: yup
        .date()
        .nullable(true)
        .transform((value, originalValue) => {
          if (typeof originalValue === "string") {
            return originalValue.trim() === "" ? null : value;
          }
          return value;
        })
        .notRequired(),
      assignmentTerm: yup.string(),
      status: yup
        .string()
        .oneOf(["available", "occupied", "decommissioned"], "Invalid status")
        .required("Status is required"),
    })
    .required();
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
  const { data: uniqueCameraId } = useUniqueCameraId();

  const { data: businessAccountsData, isLoading: businessAccountsLoading } =
    useBusinessAccounts(user?.user?.role === roleTypes.superAdmin);

  const useCreateCameraMutation = useCreateCamera();

  const selectedBusinessAccount = watch("businessAccountRef");
  const lendDateValue = watch("lendDate");
  const assignmentTermValue = watch("assignmentTerm");
  const status = watch("status");

  const {
    data: farmsByBusinessAccountRefData,
    isLoading: farmsByBusinessAccountRefLoading,
  } = useFarmsByBusinessAccountRef(selectedBusinessAccount);

  function formatTimestamp(timestamp) {
    // Parse the timestamp using Moment.js
    const date = moment(timestamp);

    // Format the date according to the desired format
    const formattedDate = date.format("MMMM D, YYYY");

    if (formattedDate === "Invalid date") {
      return "";
    }
    return formattedDate;
  }

  const handleStatusChange = (selectedOption) => {
    if (selectedOption === "available" || "decomissioned") {
      setValue("assignmentTerm", "");
      setValue("lendDate", "");
      setValue("assignedToFarm", "");
      setValue("businessAccountRef", "");
      setReturnDate("");
    }
    setValue("status", selectedOption);
  };

  const onSubmit = async (formData) => {
    setIsFormLoading(true); // Set loading state to true before making the call
    const body = {
      ...formData,
      returnDate: new Date(returnDate),
    };
    try {
      await useCreateCameraMutation.mutateAsync(body);
      toast.success("Camera added successfully");
      history.goBack();
    } catch (error) {
      toast.error("Failed to add camera");
    } finally {
      setIsFormLoading(false); // Set loading state back to false after the call completes
    }
  };
  useEffect(() => {
    if (uniqueCameraId) {
      setValue("cameraId", uniqueCameraId.cameraId);
    }
  }, [uniqueCameraId, setValue]);

  useEffect(() => {
    if (currentUserRole === roleTypes.businessAccount) {
      setValue("businessAccountRef", user?.user._id);
    }
  }, [currentUserRole, user]);

  useEffect(() => {
    if (lendDateValue && assignmentTermValue) {
      const additionalDays = assignmentTermValue.startsWith("15")
        ? 15
        : assignmentTermValue.startsWith("30")
        ? 30
        : assignmentTermValue.startsWith("45")
        ? 45
        : 0;

      if (additionalDays) {
        const lendDate = new Date(lendDateValue);
        lendDate.setDate(lendDate.getDate() + additionalDays);

        setReturnDate(lendDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
    }
  }, [lendDateValue, assignmentTermValue]);

  // useEffect(() => {
  //   if (user?.user?.role !== "superAdmin") {
  //     history.push("/not_authorized");
  //   }
  // }, [user, history]);

  return (
    <div>
      <BackButton />
      <TopHeading mainHeading={"Add Camera"} />

      {/* CARD DETAIL */}
      <div className="grid grid-cols-12 gap-4 bg-white rounded-xl drop-shadow mt-4 p-8">
        {
          <div className="flex col-span-12  justify-end">
            <span
              className={`min-w-[100px] text-sm  font-medium text-center py-2 px-4  rounded-2xl ${
                status === "occupied"
                  ? "bg-[#d4e8f8] text-[#127ed7]"
                  : status === "decommissioned"
                  ? "bg-[#ffc3c3] text-[#aa3f3e]"
                  : "bg-[#bfedbb] text-[#297c52]"
              }`}
            >
              {status === "occupied"
                ? "Occupied"
                : status === "decommissioned"
                ? "Decommissioned"
                : "Available"}
            </span>
          </div>
        }
        {/* First Row */}
        <div className="grid md:flex col-span-12  md:space-x-4  ">
          <div className="my-2 w-full">
            <label
              htmlFor="input-label"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Make <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter Camera Make"
                  disabled={false}
                  error={errors.title}
                />
              )}
            />
          </div>
          <div className="my-2 md:w-1/3">
            <label
              htmlFor="status-select"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "Available", value: "available" },
                    { label: "Occupied", value: "occupied" },
                    { label: "Decommissioned", value: "decommissioned" },
                  ]}
                  placeholder="Select Status"
                  error={errors.status}
                  onChange={handleStatusChange}
                />
              )}
            />
          </div>
          <div className="my-2 md:w-1/3 ">
            <label
              htmlFor="input-label"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              ID
            </label>
            <Controller
              control={control}
              name="cameraId"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  disabled
                  className="w-full py-2.5 pl-4 bg-[#fafafa]  outline-none border border-[#E5ECF8] rounded-lg"
                />
              )}
            />
          </div>
        </div>
        {/* Second Row */}
        <div className="grid md:flex col-span-12  md:space-x-4 md:justify-between md:mt-0 mt-10">
          <div
            className={`my-2  ${
              status === "decommissioned" ? "w-1/4" : "w-full"
            }`}
          >
            <label
              htmlFor="input-label"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Model <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="model"
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter Camera Model"
                  disabled={false}
                  error={errors.model}
                />
              )}
            />
          </div>

          {status !== "decommissioned" && (
            <div className="my-2 w-full">
              <label
                htmlFor="input-label"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Business Account
              </label>
              <Controller
                control={control}
                name="businessAccountRef"
                render={({ field }) => (
                  <ComboBox
                    {...field}
                    style={{ backgroundColor: "white" }}
                    onChange={(id) => field.onChange(id)}
                    value={field.value}
                    placeholder="Select business account"
                    disabled={
                      currentUserRole === roleTypes.businessAccount ||
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
                  />
                )}
              />
            </div>
          )}

          {status !== "decommissioned" && (
            <div className="my-2 w-full">
              <label
                htmlFor="input-label"
                className="block text-sm font-medium mb-2 dark:text-white z-30"
              >
                Farm
              </label>
              <Controller
                control={control}
                name="assignedToFarm"
                render={({ field }) => (
                  <ComboBox
                    {...field}
                    onChange={(id) => field.onChange(id)}
                    value={field.value}
                    disabled={isFormLoading}
                    placeholder={"Select farm"}
                    options={
                      farmsByBusinessAccountRefData?.map((farm) => ({
                        value: farm._id,
                        label: `${farm.farmId} - ${farm.title}`,
                      })) || []
                    }
                    loading={businessAccountsLoading}
                    error={errors.assignedToFarm}
                  />
                )}
              />
            </div>
          )}
        </div>
        {/* Third row */}
        {status !== "decommissioned" && (
          <div className="grid md:flex col-span-12  md:space-x-3 md:justify-between md:mt-4 mt-10">
            {/* <div className="my-2 w-full">
            <label
              htmlFor="status-select"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Status
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "Available", value: "available" },
                    { label: "Occupied", value: "occupied" },
                  ]}
                  placeholder="Select Status"
                  error={errors.status}
                />
              )}
            />
          </div> */}
            <div className="my-2 w-full">
              <label
                htmlFor="assignment-term-select"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Assignment Term
              </label>
              <Controller
                control={control}
                name="assignmentTerm"
                render={({ field }) => (
                  <ComboBox
                    {...field}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    placeholder="Select Available Term"
                    options={[
                      { label: "15 days", value: "15 days" },
                      { label: "30 days", value: "30 days" },
                      { label: "45 days", value: "45 days" },
                    ]}
                    error={errors.assignmentTerm}
                  />
                )}
              />
            </div>
            <div className="my-2 w-full">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Lend Date
              </label>
              <Controller
                control={control}
                name="lendDate"
                render={({ field }) => (
                  <Controller
                    control={control}
                    name="lendDate"
                    render={({ field }) => (
                      <CustomDatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder="Select lend date"
                        error={errors.lendDate}
                      />
                    )}
                  />
                )}
              />
            </div>{" "}
            {/* <div className=" my-2 w-full  ">
            <label
              htmlFor="return-date-input"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Return Date
            </label> */}
            <div className=" my-2 w-full ">
              <label
                htmlFor="return-date-input"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Due Date
              </label>
              <input
                id="return-date-input"
                type="text"
                value={formatTimestamp(returnDate)}
                disabled={true}
                className="w-full py-2.5  pl-4 bg-[#fafafa]  outline-none border border-[#E5ECF8] rounded-lg"
              />
            </div>
          </div>
        )}
        {/* Fourth row */}
        {/* <div className="flex col-span-12 md:col-span-4 space-x-4  my-4"></div> */}

        {/* Footer */}
        <div className="col-span-12 flex flex-col-reverse md:flex-row justify-center md:justify-end md:space-x-4 mt-4">
          <button
            className="text-slate-500 w-full md:w-[153px] h-[46px] rounded-lg"
            type="submit"
            onClick={() => history.goBack()}
            disabled={isFormLoading}
          >
            Cancel
          </button>
          <button
            className="w-full md:w-[108px] h-[44px] flex justify-center items-center
           text-white gap-[5px] bg-primary-main rounded-lg"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isFormLoading}
          >
            {isFormLoading ? <ButtonSpinner color="text-white" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCamera;

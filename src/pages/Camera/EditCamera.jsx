import { yupResolver } from "@hookform/resolvers/yup";
import TopHeading from "components/TopHeading";
import BackButton from "components/common/Buttons/BackButton";
import Input from "components/common/controls/Input";
import * as yup from "yup";
import { cameraStatus, roleTypes } from "utils/constants";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import ComboBox from "components/common/controls/ComboBox";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useBusinessAccounts } from "hooks/useUser";
import { useUpdateCamera, useDeleteCamera } from "hooks/useCamera";
import { useFarmsByBusinessAccountRef } from "hooks/useFarmManagement";
import Select from "components/common/controls/Select";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "components/common/controls/CustomDatePicker";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { toast } from "react-toastify";
import moment from "moment";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import Table from "components/table/Table";
import PaginationStatic from "components/table/PaginationStatic";
//
const EditCamera = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const [isFormLoading, setIsFormLoading] = useState(false);
  // const [returnDate, setReturnDate] = useState("");
  const location = useLocation();

  console.log("😀😀", location);
  const currentUserRole = user?.user?.role;
  const lendingHistory = location?.state?.lendingHistory;

  const lendingHistoryConfig = {
    columns: [
      {
        headerName: "S.No",
        field: "cameraId",
        render: (data) => (
          <span className="flex items-center gap-2">{data?.sNo}</span>
        ),
      },
      {
        headerName: "Bussiness Account",
        field: "businessAccountRef",
        render: (data) => (
          <span className="flex items-center gap-2">
            {data?.businessAccountRef}
          </span>
        ),
      },
      {
        headerName: "Farm ID",
        field: "assignedToFarm",
        render: (data) => (
          <span className="flex items-center gap-2">
            {data?.assignedToFarm}
          </span>
        ),
      },
      {
        headerName: "Lend Date",
        field: "lendDate",
        render: (data) => (
          <span className="flex items-center gap-2">
            {formatTimestamp(data?.lendDate)}
          </span>
        ),
      },
      {
        headerName: "Due Date",
        field: "returnDate",
        render: (data) => (
          <span className="flex items-center gap-2">
            {formatTimestamp(data?.returnDate)}
          </span>
        ),
      },
    ],
  };

  const initialFormState = {
    cameraId: location?.state?.cameraId,
    title: location?.state?.title,
    model: location?.state?.model,
    businessAccountRef: location?.state?.businessAccountRef?._id,
    assignedToFarm: location?.state?.assignedToFarm?._id,
    status: location?.state?.status,
    assignmentTerm: location?.state?.assignmentTerm,
    lendDate: location?.state?.lendDate,
    returnDate: location?.state?.returnDate,
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
    getValues,
    watch,
    resetField,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialFormState,
  });

  const { data: businessAccountsData, isLoading: businessAccountsLoading } =
    useBusinessAccounts(user?.user?.role === roleTypes.superAdmin);

  const useUpdateCameraMutation = useUpdateCamera();
  const useDeleteCameraMutation = useDeleteCamera();

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
      return null;
    }
    return formattedDate;
  }

  const handleStatusChange = (selectedOption) => {
    // if (
    //   selectedOption === cameraStatus.avaialabe ||
    //   cameraStatus.decommissioned
    // ) {
    //   setValue("assignmentTerm", "");
    //   setValue("lendDate", "");
    //   setValue("assignedToFarm", "");
    //   setValue("businessAccountRef", "");
    //   setValue("returnDate", "");
    // }

    setValue("status", selectedOption);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(lendingHistory.length / itemsPerPage);

  // Set current page data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, lendingHistory.length);
  const currentPageData = lendingHistory.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const swalWithRoundedBorder = Swal.mixin({
    customClass: {
      popup: "rounded-[10px] w-[400px]",
    },
    buttonsStyling: true,
    confirmButtonColor: "#5604A9", // Custom color for the confirm button
    cancelButtonColor: "#fff", // Custom color for the cancel button
  });

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "custom-confirm-button-class",
      cancelButton: "custom-cancel-button-class",
    },
    buttonsStyling: false,
  });
  const handleDelete = (itemId) => {
    swalWithRoundedBorder
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        iconColor: "#5604A9",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          useDeleteCameraMutation.mutate(itemId, {
            onSuccess: () => {
              swalWithBootstrapButtons
                .fire({
                  title: "Deleted!",
                  text: "Camera has been deleted.",
                  icon: "success",
                  timer: 1000,
                  showConfirmButton: false,
                })
                .then(() => {
                  if (window.history.length > 2) {
                    history.goBack();
                  } else {
                    history.push("/camera_management");
                  }
                });
            },
            onError: (error) => {
              swalWithBootstrapButtons.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error",
                timer: 1000,
                showConfirmButton: false,
              });
              console.error("Error deleting:", error);
            },
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "",
            icon: "error",
            timer: 1000,
            showConfirmButton: false,
          });
        }
      });
  };
  const onSubmit = async (formData) => {
    console.log("Attempting to submit form", formData);
    setIsFormLoading(true); // Set loading state to true before making the call
    const body = {
      ...formData,
      _id: location?.state?._id,
      lendingHistory: location?.state?.lendingHistory,
    };
    try {
      await useUpdateCameraMutation.mutateAsync(body);
      toast.success("Camera updated successfully");
      history.goBack();
    } catch (error) {
      toast.error("Failed to update camera");
    } finally {
      setIsFormLoading(false); // Set loading state back to false after the call completes
    }
  };

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
        setValue("returnDate", lendDate.toISOString().split("T")[0]); // Set returnDate using setValue
      }
    } else if (status === "available") {
      setValue("returnDate", null);
    }
  }, [lendDateValue, assignmentTermValue, status, setValue]);

  // useEffect(() => {
  //   if (user?.user?.role !== "superAdmin") {
  //     history.push("/not_authorized");
  //   }
  // }, [user, history]);

  const handleReceived = async () => {
    // Reset specific values to their defaults or to empty
    // setValue("assignmentTerm", "");
    // setValue("lendDate", "");
    // setValue("assignedToFarm", "");
    // setValue("businessAccountRef", "");
    // setValue("returnDate", "");
    setValue("status", "available");

    // Perform form submission manually
    const formData = {
      ...getValues(), // Get current form values including the ones just reset
    };

    onSubmit(formData); // Directly call onSubmit with the modified form data
  };

  return (
    <div>
      <BackButton />
      <div className="flex justify-between">
        <TopHeading mainHeading={"Camera Details"} />
        <button
          className="w-[108px] h-[44px] flex justify-center items-center
           text-white gap-[5px] bg-primary-main rounded-lg "
          type="button"
          onClick={() => handleReceived()}
          disabled={isFormLoading}
        >
          Received
        </button>
      </div>

      {/* CARD DETAIL */}
      <div className="grid grid-cols-12 gap-4 bg-white rounded-xl drop-shadow mt-4 p-8">
        {
          <div className="col-span-12 flex justify-end">
            <span
              className={`min-w-[100px] text-sm  font-bold text-center py-1 px-3 rounded-2xl ${
                status === cameraStatus.occupied
                  ? "bg-[#d4e8f8] text-[#127ed7]"
                  : status === cameraStatus.decommissioned
                  ? "bg-[#ffc3c3] text-[#aa3f3e]"
                  : "bg-[#bfedbb] text-[#297c52]"
              }`}
            >
              {status === cameraStatus.occupied
                ? "Occupied"
                : status === cameraStatus.decommissioned
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
                  className="w-full py-2.5  pl-4 bg-[#fafafa]  outline-none border border-[#E5ECF8] rounded-lg"
                />
              )}
            />
          </div>
        </div>
        {/* Second Row */}
        <div className="grid md:flex col-span-12  md:space-x-4 md:justify-between md:mt-0 mt-10">
          {/* <div className="my-2 w-full"> */}
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

          {status !== cameraStatus.decommissioned && (
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
                        value: account?._id,
                        label: account?.businessAccountName,
                      })) || []
                    }
                    loading={businessAccountsLoading}
                    error={errors.businessAccountRef}
                  />
                )}
              />
            </div>
          )}
          {status !== cameraStatus.decommissioned && (
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
                        value: farm?._id,
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
        {status !== cameraStatus.decommissioned && (
          <div className="grid md:flex col-span-12  md:space-x-3 md:justify-between md:mt-4 mt-10">
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
            <div className=" my-2 w-full ">
              <label
                htmlFor="return-date-input"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Due Date
              </label>
              <Controller
                control={control}
                name="returnDate"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    disabled={true}
                    className="w-full py-2.5  pl-4 bg-[#fafafa]  outline-none border border-[#E5ECF8] rounded-lg"
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex col-span-12 justify-center md:justify-end mt-4">
          <div className="flex flex-col-reverse md:flex-row md:justify-between mt-4 w-full md:w-auto">
            <button
              className="text-red-500 md:mr-12 h-[46px] rounded-lg"
              type="button"
              onClick={() => handleDelete(location?.state?._id)}
              disabled={isFormLoading}
            >
              Delete
            </button>
            <button
              className="text-slate-500 md:mr-12 h-[46px] rounded-lg"
              type="button"
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
              {isFormLoading ? <ButtonSpinner color="text-white" /> : "Update"}
            </button>
          </div>
        </div>
      </div>
      {/* Lending History */}
      <hr className="text-black my-10 w-full border" />
      <div className="overflow-x-auto w-full">
        <TopHeading mainHeading={"Lending History"} />
        <Table
          data={currentPageData || []}
          isLoading={false}
          {...lendingHistoryConfig}
        />
        <PaginationStatic
          totalItems={lendingHistory.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
        ;
      </div>
    </div>
  );
};

export default EditCamera;

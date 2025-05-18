import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CameraIcon from "assets/icons/CameraIcon";
import { useSelector, useDispatch } from "react-redux";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { updateUser } from "../../redux/Slices/UserSlice";
import {
  useUpdateCoverImg,
  useUpdateUserById,
  useUserById,
} from "hooks/useUser";
import SettingsChangePassword from "./SettingsChangePassword";
import { toast } from "react-toastify";
import PhoneNumberInputComponent from "components/common/controls/PhoneNumber";
import { roleTypes } from "utils/constants";

const validationSchema = (currentUserRole) =>
  Yup.object().shape({
    name: Yup.string().when("role", (role, schema) => {
      return [roleTypes.businessAccount].includes(currentUserRole)
        ? schema.notRequired()
        : schema.required("Name is required");
    }),
    businessAccountName: Yup.string().when("role", (role, schema) => {
      return [roleTypes.businessAccount].includes(currentUserRole)
        ? schema.required("Business Account Name is required")
        : schema.notRequired();
    }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(
        /^\+?\d+$/,
        "Phone number must only contain numbers and may start with a +"
      )
      .required("Phone number is required"),
  });

export default function Settings() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const useUpdateCoverImgMutation = useUpdateCoverImg();
  const useUpdateUserByIdMutation = useUpdateUserById();

  const { user } = useSelector((state) => state.user);
  const currentUserRole = user?.user?.role;
  const { data: userData, refetch, isLoading } = useUserById(user.user._id);

  const profileImageUrl = userData?.profileImageUrl;
  const handleFileButtonClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userData?.fullName,
      businessAccountName: userData?.businessAccountName,
      email: userData?.email,
      phone: userData?.phoneNumber,
    },
    validationSchema: validationSchema(currentUserRole),
  });

  const handleFileChange = async (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    if (formik.isValid) {
      useUpdateUserByIdMutation.mutate(
        {
          fullName: formik.values.name,
          businessAccountName: formik.values.businessAccountName,
          email: formik.values.email,
          phoneNumber: formik.values.phone,
        },
        {
          onSuccess: () => {
            toast.success("Successfully Updated Details");
            refetch();
            if (selectedFile) {
              useUpdateCoverImgMutation.mutate(selectedFile, {
                onSuccess: (data) => {
                  refetch();
                  setSelectedFile(null);
                },
                onError: () => {},
              });
            }
          },
          onError: () => {
            toast.error("An error occurred. Please try again later");
          },
        }
      );
    } else {
      console.log("Form validation failed");
    }
  };
  const imageSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : profileImageUrl || "/profile_Image.jpg";

  useEffect(() => {
    if (!userData) {
      refetch();
    }
  }, [userData, refetch]);

  return (
    <div className="">
      <div className="p-5 border bg-white border-light drop-shadow-md max-sm:p-[10px] rounded-md">
        {/* upper card */}
        <div className="font-bold text-[#909FBA] mb-16">
          Personal Information
        </div>
        <div className="flex gap-8">
          <div className="relative">
            <img
              onClick={handleFileButtonClick}
              src={imageSrc}
              alt="ProfileImage"
              className="rounded-full w-[120px] h-[120px] border border-gray-300 cursor-pointer"
            />
            <CameraIcon className="absolute right-3 bottom-3 " />
            <input
              ref={fileInputRef}
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-2xl font-bold text-[#333333]">
              {userData?.fullName || userData?.businessAccountName}
            </div>
            <div className="text-sm text-[#909FBA] font-normal">
              {userData?.email}
            </div>
          </div>
        </div>

        <div>
          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4  gap-y-4 ">
              {currentUserRole === roleTypes.businessAccount ? (
                <div className="flex-1">
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    Business Account Name:
                  </label>
                  <input
                    type="text"
                    name="businessAccountName"
                    placeholder="Enter your business name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.businessAccountName}
                    className="py-3 px-4  w-full  border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
                  />
                  {formik.touched.businessAccountName &&
                  formik.errors.businessAccountName ? (
                    <div className="text-red-500">
                      {formik.errors.businessAccountName}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex-1">
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className="py-3 px-4  w-full  border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500">{formik.errors.name}</div>
                  ) : null}
                </div>
              )}

              <div className="flex-1">
                <label
                  htmlFor="input-label"
                  className="block text-sm font-medium mb-2 dark:text-white"
                >
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="py-3 px-4 block w-full border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="flex-1 z-50">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2 dark:text-white"
                >
                  Phone Number:
                </label>
                <PhoneNumberInputComponent
                  value={formik.values.phone}
                  onChange={(value) => formik.setFieldValue("phone", value)}
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.phone && formik.touched.phone
                      ? { message: formik.errors.phone }
                      : undefined
                  }
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                type="submit"
                className="bg-primary-main disabled:bg-primary-light  text-white w-[200px] h-[46px]   rounded-lg flex justify-center items-center font-bold"
                disabled={
                  useUpdateCoverImgMutation.isLoading ||
                  useUpdateUserByIdMutation.isLoading
                }
              >
                {useUpdateCoverImgMutation.isLoading ||
                useUpdateUserByIdMutation.isLoading ? (
                  <ButtonSpinner />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="p-5 border bg-white border-light  max-sm:p-[10px] rounded-md mt-10">
        <SettingsChangePassword />
      </div>
    </div>
  );
}

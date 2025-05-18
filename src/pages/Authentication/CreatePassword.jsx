import Logo from "assets/icons/Logo";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useSetPassword } from "hooks/useAuth";
import { toast } from "react-toastify";

const CreatePassword = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [submitting, setSubmitting] = useState(false);
  const useSetPasswordMutation = useSetPassword();
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must be 8 including numbers & capitals"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = {
      token,
      password: formik.values.newPassword,
      confirmPassword: formik.values.confirmPassword,
    };
    console.log(params);
    useSetPasswordMutation.mutate(params, {
      onSuccess: (data) => {
        toast.success("Successfully Password Changed");
        history.push(`/password-success`);
      },
      onError: () => {
        toast.error("An error occurred. Please try again later");
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      // Handle form submission here
      console.log("Form submitted with values:", values);
      setSubmitting(false);
    },
  });

  return (
    <div className="flex items-center justify-center mt-[5%]">
      <div className="flex flex-col items-center justify-center">
        <Logo /> {/* Adjust margin-bottom for Logo */}
        <h1 className="text-[#1B2559] text-3xl font-bold">Broodbox</h1>
        <h1
          className="text-3xl font-bold mt-4"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          Let’s choose a new Password
        </h1>
        <span className="text-[18px] text-[#333333] mt-2">
          Enter your new password
        </span>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-10 flex-col justify-center items-center flex space-y-4"
        >
          <div className="mb-4 ">
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-[360px] border-b border-gray-300  py-4 focus:outline-none"
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="text-red-600">{formik.errors.newPassword}</div>
            ) : null}
          </div>
          <div className="mb-4 ">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-[360px] border-b border-gray-300  py-4 focus:outline-none "
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-600">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            style={{ marginTop: "30%" }}
            onClick={handleSubmit}
            className="bg-primary-main text-white font-bold  w-[360px] h-[46px] rounded-lg "
          >
            {useSetPasswordMutation.isLoading ? (
              <ButtonSpinner color="text-white" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;

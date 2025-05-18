import { useFormik } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "hooks/useUser";
import { useSelector } from "react-redux";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { toast } from "react-toastify";

// Validation schema for the password change form
const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

export default function SettingsChangePassword() {
  const { user } = useSelector((state) => state.user);
  const { _id } = user.user;
  const useResetPasswordMutation = useResetPassword();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formik.isValid) {
      useResetPasswordMutation.mutate(
        {
          _id,
          oldPassword: formik.values.currentPassword,
          newPassword: formik.values.newPassword,
        },
        { onSuccess: () => toast.success("Successfully Password Changed") },
        {
          onError: () =>
            toast.error("An error occurred. Please try again later"),
        }
      );
    }
  };
  return (
    <div>
        <div className="font-bold text-[#909FBA] mb-8">
          Update Password
        </div>

      {/* Form 2: Password Change */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="input-label"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Current Password<span className="text-red-500">*</span>
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Current Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
            className="py-3 px-4 block w-full lg:w-[40%] border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
          />
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <div className="text-red-500">{formik.errors.currentPassword}</div>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="input-label"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            New Password<span className="text-red-500">*</span>
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="New Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            className="py-3 px-4 block w-full lg:w-[40%] border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="text-red-500">{formik.errors.newPassword}</div>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="input-label"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="py-3 px-4 block w-full lg:w-[40%] border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <div className="flex justify-end">
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-primary-main  text-white w-[200px] h-[46px]   rounded-lg flex justify-center items-center font-bold"
            >
              {useResetPasswordMutation.isLoading ? (
                <ButtonSpinner />
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

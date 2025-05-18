import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory, Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useQueryParams from "hooks/common/useQueryParams";
import { LOGIN_PAGE_REDIRECT_TYPES } from "utils/constants";
import Loader from "components/common/Loader";
import signinIcon from "../../images/icons/SigninIcon.svg";
import { loginUser } from "../../redux/Slices/UserSlice";
import * as Yup from "yup";
import { Suspense } from "react";
import { useLogin } from "hooks/useAuth";

const SignIn = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  let query = useQueryParams();
  const redirectUrlType = query.get("redirectType");
  const [redirectError, setRedirectError] = useState(null);

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Email Invalid").required("User Name Required!"),
    password: Yup.string().required("Password Required!"),
  });

  const { mutate: loginMutation, isLoading: loginLoading } = useLogin();

  const handleSignin = (values) => {
    loginMutation(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("user", JSON.stringify(response));
          dispatch(loginUser(response));
          history.push("/dashboard");
        },
        onError: (error) => {
          toast.error(error.response.data.error);
        },
      }
    );
  };

  useEffect(() => {
    if (redirectUrlType === LOGIN_PAGE_REDIRECT_TYPES.accountNoLongerExists) {
      setRedirectError(
        "Your account is not active. Contact support for further details."
      );

      setTimeout(() => {
        setRedirectError("");
        history.push('/auth/signin')
      }, 7000);
    }
  }, [redirectUrlType]);

  if (loadingState || loginLoading) {
    return <Loader />;
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        <section className="w-full flex justify-center items-center bg-[#2B2B2B] h-screen">
          <div className="w-[350px] flex flex-col items-center py-[65px] rounded-[20px] bg-white ">
            {/* Sign In Heading Start  */}
            <div className="flex items-center gap-[15px] ">
              <div>
                <img src={signinIcon} alt="SignIN Icon" />
              </div>
              <div>
                <h1 className="text-[36px] leading-[32px] tracking-[-0.72px] font-bold not-italic text-DM-Sans capitalize ">
                  Sign In
                </h1>
              </div>
            </div>
            {/* Sign In Heading End  */}

            {redirectError && (
              <div
                className="alert alert-light mt-4 of-br mb-0 d-snone text-red-500 text-center px-6"
                role="alert"
              >
                <i className="bi bi-exclamation-circle-fill me-1" />{" "}
                {redirectError}
              </div>
            )}

            {/* Form Heading Start  */}
            <Formik
              initialValues={{
                email: "",
                password: "",
                remeber: false,
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSignin}
            >
              {({ errors, touched }) => (
                <Form className="w-full flex flex-col mt-[56px] items-center gap-y-[21px] max-sm:px-[15px] px-[27px]">
                  <div className="w-full flex flex-col items-center gap-y-[10px]">
                    <Field
                      type="email"
                      className="h-[53px] bg-[#F4F4F4] rounded-[81px] w-full px-[34px]  "
                      id="email"
                      name="email"
                      placeholder="Email"
                    />
                    {errors.email && touched.email ? (
                      <span className="text-[#f84f4f] text-center text-[12px]">
                        {errors.email}
                      </span>
                    ) : null}
                  </div>

                  <div className="w-full flex flex-col items-center gap-y-[10px] relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      className="h-[53px] bg-[#F4F4F4] rounded-[81px] px-[34px] w-full "
                      id="password"
                      name="password"
                      placeholder="Password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    {errors.password && touched.password ? (
                      <small className="text-[#f84f4f] text-center text-[12px]">
                        {errors.password}
                      </small>
                    ) : null}
                  </div>

                  <label className="flex items-center text-[#4F5360] text-[12px] text-DM-Sans font-medium leading-[24px] tracking-[-0.24px] ">
                    <Field
                      type="checkbox"
                      className="me-[10px] w-[17px] h-[17px] accent-[#6601E7]  text-white"
                      name="remeber"
                    />
                    Remeber me
                  </label>
                  <button
                    className="w-full h-[46px] rounded-[70px] text-center text-[14px] font-medium leading-[24px]  tracking-[-0.28px] text-white bg-primary-main "
                    type="submit"
                  >
                    Login
                  </button>
                  <label className="text-center mt-[6px] text-[#4F5360] text-[12px] font-medium leading-[24px] tracking-[-0.24px] underline cursor-pointer text-DM-Sans ">
                    <Link to={"/forgot-password"}>Forget Password</Link>
                  </label>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Suspense>
    </>
  );
};

export default SignIn;

import signinIcon from "../../images/icons/SigninIcon.svg";
import { Formik, Field, Form } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const history = useHistory();
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("User Name Required!"),
    email: Yup.string().email("Email Invalid").required("Email Required!"),
    password: Yup.string().required("Password Required!"),
  });

  // const SignInButtons = [
  //   {
  //     id : 1,
  //     text : "Continue with Google",
  //     svg : <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  //     <path d="M25.6442 10.4121H24.6012V10.3584H12.948V15.5376H20.2656C19.198 18.5526 16.3294 20.7168 12.948 20.7168C8.65769 20.7168 5.17921 17.2383 5.17921 12.948C5.17921 8.65769 8.65769 5.17921 12.948 5.17921C14.9284 5.17921 16.7301 5.92631 18.102 7.14666L21.7643 3.48431C19.4518 1.32911 16.3585 0 12.948 0C5.79747 0 0 5.79747 0 12.948C0 20.0986 5.79747 25.896 12.948 25.896C20.0986 25.896 25.896 20.0986 25.896 12.948C25.896 12.0798 25.8067 11.2324 25.6442 10.4121Z" fill="#FFC107"/>
  //     <path d="M1.4929 6.92136L5.74697 10.0412C6.89805 7.19133 9.68576 5.17921 12.948 5.17921C14.9284 5.17921 16.7301 5.92631 18.102 7.14666L21.7643 3.48431C19.4518 1.32911 16.3585 0 12.948 0C7.97468 0 3.6617 2.80778 1.4929 6.92136Z" fill="#FF3D00"/>
  //     <path d="M12.948 25.896C16.2925 25.896 19.3314 24.6161 21.629 22.5347L17.6216 19.1436C16.3216 20.1283 14.7057 20.7168 12.948 20.7168C9.58023 20.7168 6.72066 18.5694 5.64339 15.5726L1.42104 18.8258C3.56394 23.019 7.91577 25.896 12.948 25.896Z" fill="#4CAF50"/>
  //     <path d="M25.6442 10.4121H24.6012V10.3584H12.948V15.5376H20.2656C19.7528 16.9858 18.8212 18.2347 17.6197 19.1443C17.6203 19.1436 17.621 19.1436 17.6216 19.143L21.629 22.5341C21.3454 22.7917 25.896 19.422 25.896 12.948C25.896 12.0798 25.8067 11.2324 25.6442 10.4121Z" fill="#1976D2"/>
  //     </svg>
  //   },
  //   {
  //     id : 2,
  //     text : "Continue with Github",
  //     svg : <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  //     <path d="M15 1.25C11.3918 1.21334 7.91672 2.61076 5.33841 5.13516C2.76011 7.65955 1.28958 11.1044 1.25 14.7125C1.2639 17.564 2.18118 20.3377 3.87008 22.6352C5.55898 24.9327 7.93259 26.6359 10.65 27.5C11.3375 27.625 11.5875 27.2125 11.5875 26.85C11.5875 26.4875 11.5875 25.6875 11.5875 24.5625C7.7625 25.375 6.95 22.7625 6.95 22.7625C6.69537 21.9424 6.15404 21.2413 5.425 20.7875C4.175 19.9625 5.525 19.975 5.525 19.975C5.95706 20.0328 6.37044 20.1876 6.73414 20.4279C7.09783 20.6682 7.4024 20.9877 7.625 21.3625C8.01291 22.0352 8.64942 22.5286 9.39751 22.7367C10.1456 22.9447 10.9455 22.8508 11.625 22.475C11.6949 21.7905 12.0049 21.1528 12.5 20.675C9.45 20.3375 6.25 19.1875 6.25 14.025C6.22272 12.6784 6.7203 11.3739 7.6375 10.3875C7.21978 9.23134 7.26911 7.95789 7.775 6.8375C7.775 6.8375 8.9375 6.475 11.525 8.2125C13.7774 7.6123 16.1476 7.6123 18.4 8.2125C21.025 6.475 22.15 6.8375 22.15 6.8375C22.6559 7.95789 22.7052 9.23134 22.2875 10.3875C23.226 11.3558 23.7506 12.6515 23.75 14C23.75 19.175 20.525 20.3125 17.5 20.65C17.8312 20.9716 18.0871 21.3626 18.2492 21.7948C18.4113 22.2271 18.4756 22.6899 18.4375 23.15V26.8375C18.4375 26.8375 18.6875 27.625 19.375 27.4875C22.0847 26.618 24.4503 24.9145 26.134 22.6202C27.8177 20.3259 28.7333 17.5582 28.75 14.7125C28.7104 11.1044 27.2399 7.65955 24.6616 5.13516C22.0833 2.61076 18.6082 1.21334 15 1.25Z" fill="#231F20"/>
  //     </svg>
  //   },
  //   {
  //     id : 3,
  //     text : "Continue with Slack",
  //     svg : <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  //     <path d="M5.45938 16.3575C5.45938 17.8615 4.2439 19.0769 2.73999 19.0769C1.23609 19.0769 0.0205994 17.8615 0.0205994 16.3575C0.0205994 14.8536 1.23609 13.6382 2.73999 13.6382H5.45938V16.3575ZM6.81908 16.3575C6.81908 14.8536 8.03456 13.6382 9.53847 13.6382C11.0424 13.6382 12.2579 14.8536 12.2579 16.3575V23.156C12.2579 24.6599 11.0424 25.8754 9.53847 25.8754C8.03456 25.8754 6.81908 24.6599 6.81908 23.156V16.3575Z" fill="#E01E5A"/>
  //     <path d="M9.53847 5.43878C8.03457 5.43878 6.81908 4.2233 6.81908 2.71939C6.81908 1.21549 8.03457 0 9.53847 0C11.0424 0 12.2579 1.21549 12.2579 2.71939V5.43878H9.53847ZM9.53847 6.81908C11.0424 6.81908 12.2579 8.03457 12.2579 9.53847C12.2579 11.0424 11.0424 12.2579 9.53847 12.2579H2.71939C1.21549 12.2579 0 11.0424 0 9.53847C0 8.03457 1.21549 6.81908 2.71939 6.81908H9.53847Z" fill="#36C5F0"/>
  //     <path d="M20.4366 9.53847C20.4366 8.03457 21.6521 6.81908 23.156 6.81908C24.6599 6.81908 25.8754 8.03457 25.8754 9.53847C25.8754 11.0424 24.6599 12.2579 23.156 12.2579H20.4366V9.53847ZM19.0769 9.53847C19.0769 11.0424 17.8615 12.2579 16.3576 12.2579C14.8536 12.2579 13.6382 11.0424 13.6382 9.53847V2.71939C13.6382 1.21549 14.8536 0 16.3576 0C17.8615 0 19.0769 1.21549 19.0769 2.71939V9.53847Z" fill="#2EB67D"/>
  //     <path d="M16.3576 20.4366C17.8615 20.4366 19.0769 21.6521 19.0769 23.156C19.0769 24.6599 17.8615 25.8754 16.3576 25.8754C14.8536 25.8754 13.6382 24.6599 13.6382 23.156V20.4366H16.3576ZM16.3576 19.0769C14.8536 19.0769 13.6382 17.8615 13.6382 16.3575C13.6382 14.8536 14.8536 13.6382 16.3576 13.6382H23.1766C24.6805 13.6382 25.896 14.8536 25.896 16.3575C25.896 17.8615 24.6805 19.0769 23.1766 19.0769H16.3576Z" fill="#ECB22E"/>
  //     </svg>
  //   },
  // ]

  return (
    <>
      <section className="w-full flex justify-center items-center bg-[#2B2B2B] h-screen">
        <div className="w-[350px] flex flex-col items-center py-[65px] rounded-[20px] bg-white ">
          {/* Sign In Heading Start  */}
          <div className="flex items-center gap-[15px] ">
            <div>
              <img src={signinIcon} alt="SignIN Icon" />
            </div>
            <div>
              <h1 className="text-[36px] leading-[32px] tracking-[-0.72px] font-bold not-italic text-DM-Sans capitalize ">
                Sign Up
              </h1>
            </div>
          </div>
          {/* Sign In Heading End  */}

          {/* Form Heading Start  */}
          <Formik
            initialValues={{
              firstName: "",
              email: "",
              password: "",
              remeber: false,
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              try {
                const credentials = {
                  name: values.firstName,
                  email: values.email,
                  password: values.password,
                };
                const res = await axios.post(
                  `${process.env.REACT_APP_BASE_URL}/v1/auth/register`,
                  credentials
                );
                if (res.status === 201) {
                  toast.success('Successfully registered');
                  history.push("/auth/signin");
                }
              } catch (error) {
                toast.error(error.message);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="w-full flex flex-col mt-[56px] items-center gap-y-[21px] max-sm:px-[15px] px-[27px]">
                <div className="w-full flex flex-col items-center gap-y-[10px]">
                  <Field
                    className="h-[53px] bg-[#F4F4F4] rounded-[81px] w-full px-[34px]  "
                    id="firstName"
                    name="firstName"
                    placeholder="User Name"
                  />
                  {errors.firstName && touched.firstName ? (
                    <span className="text-[#f84f4f] text-center text-[12px]">
                      {errors.firstName}
                    </span>
                  ) : null}
                </div>
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

                <div className="w-full flex flex-col items-center gap-y-[10px]">
                  <Field
                    type="password"
                    className="h-[53px] bg-[#F4F4F4] rounded-[81px] px-[34px] w-full "
                    id="password"
                    name="password"
                    placeholder="password"
                  />
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
                <small className="text-center">
                  {" "}
                  Create an Account{" "}
                  <Link to={"/auth/signin"} className="text-[#6601E7]">
                    SignIn
                  </Link>{" "}
                </small>
                <label className="text-center mt-[6px] text-[#4F5360] text-[12px] font-medium leading-[24px] tracking-[-0.24px] underline cursor-pointer text-DM-Sans ">
                  Forget Password
                </label>

                {/* <p className='text-[#4F5360] text-[12px] font-medium leading-[24px] tracking-[-0.24px] text-DM-Sans ' >OR Sign In With</p> */}
                {/* Google Signin Start */}

                {/* <div className='flex flex-col gap-y-[6px] w-full   mt-[13px]'   >

          {
            SignInButtons?.map(btn => (
              <button key={btn.id} className='w-full rounded-[70px] border-[0.5px] flex justify-center gap-x-[13px] items-center border-[#000000] h-[46px] bg-[#F8F8F8]' >
                {btn.svg}
              <h2 className='text-primary-main text-[14px] font-medium leading-[24px] tracking-[-0.28px] text-DM-Sans ' >{btn.text}</h2>
              </button>
            ))
          }

          

        </div> */}

                {/* Google Signin End */}
              </Form>
            )}
          </Formik>
          {/* Form Heading End  */}
        </div>
      </section>
    </>
  );
};

export default SignUp;

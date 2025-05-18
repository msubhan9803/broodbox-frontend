import { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import { useQueryClient } from "react-query";
import { jwtDecode } from "jwt-decode";
import useQueryParams from "hooks/common/useQueryParams";
import { useUserById } from "hooks/useUser";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "pages/Authentication/SignIn";
import SignUp from "pages/Authentication/SignUp";
import LoadingSpinner from "components/common/Loader";
import routes from "routes";
import NotAuthorized from "pages/NotAuthorized";
import NotFound from "pages/NotFound";
import DefaultLayout from "layout/DefaultLayout";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";
import VerificationSuccess from "pages/Authentication/VerificationSuccess";
import VerificationFailed from "pages/Authentication/VerificationFailed";
import TOS from "pages/Authentication/TOS";
import CreatePassword from "pages/Authentication/CreatePassword";
import PasswordSuccessfull from "pages/Authentication/PasswordSuccessfull";
import EmailSent from "pages/Authentication/EmailSent";
import ForgotPassword from "pages/Authentication/ForgotPassword";
import { logOut } from "./redux/Slices/UserSlice";
import TourComponent from "components/TourComponent";

const pathsToExcludeAuthCheck = [
  "/verify-email",
  "/verification-failed",
  "/tos",
  "/password-success",
  "/email-sent",
  "/forgot-password",
  "/create-password",
];

const pathsToUnauthenticatedWithAuthCheck = ["/auth/signin", "/auth/signup"];

function App() {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { data: privilegedModulesData, isLoading: privilegedModulesLoading } =
    useGetPrivilegesByRoleName(user?.user?.role);
  const { data: userData } = useUserById(user?.user?._id);
  let location = useLocation();
  let background = location.state && location.state.background;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const history = useHistory();
  let query = useQueryParams();
  const redirectUrlType = query.get("redirectType");

  const handleRedirectToSignin = (url) => {
    dispatch(logOut());
    history.push(url || "/auth/signin");
    queryClient.clear();
  };

  const handleRedirectToDashboard = () => {
    history.push("/dashboard");
  };

  const checkToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return false;
    }

    const decodedToken = jwtDecode(user.tokens.access.token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (pathsToExcludeAuthCheck.includes(location.pathname)) {
      // Skip authentication check for specified paths
      return;
    }

    const isAuthenticated = checkToken();
    if (
      pathsToUnauthenticatedWithAuthCheck.includes(location.pathname) &&
      isAuthenticated
    ) {
      handleRedirectToDashboard();
    } else if (!isAuthenticated) {
      if (redirectUrlType) {
        handleRedirectToSignin(
          "/auth/signin?redirectType=accountNoLongerExists"
        );
      } else {
        handleRedirectToSignin();
      }
    }
  }, [location.pathname]);

  if (loading || privilegedModulesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ToastContainer
        className="z-99999"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />

      <TourComponent userData={userData} />

      <Switch location={background || location}>
        <Route exact path="/" render={() => <Redirect to="/auth/signin" />} />
        <Route exact path="/auth/signin" render={() => <SignIn />} />
        <Route exact path="/auth/signup" render={() => <SignUp />} />
        <Route
          exact
          path="/verify-email"
          render={() => <VerificationSuccess />}
        />

        <Route
          exact
          path="/verification-failed"
          render={() => <VerificationFailed />}
        />
        <Route exact path="/tos" render={() => <TOS />} />
        <Route
          exact
          path="/password-success"
          render={() => <PasswordSuccessfull />}
        />
        <Route exact path="/email-sent" render={() => <EmailSent />} />
        <Route
          exact
          path="/forgot-password"
          render={() => <ForgotPassword />}
        />
        <Route
          exact
          path="/create-password"
          render={() => <CreatePassword />}
        />
        {privilegedModulesData &&
          routes
            .filter((route) => !route.isDrawer)
            .map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={true}
                  render={(props) => (
                    <DefaultLayout>
                      <route.component {...props} {...route.customProps} />
                    </DefaultLayout>
                  )}
                />
              );
            })}

        <Route
          exact
          path="/not_authorized"
          render={(props) => <NotAuthorized />}
        />
        <Route path="*" render={(props) => <NotFound />} />
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && (
        <>
          {routes
            .filter((route) => route.isDrawer)
            .map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={true}
                  render={(props) => (
                    <route.component {...props} {...route.customProps} />
                  )}
                />
              );
            })}
        </>
      )}
    </>
  );
}

export default App;

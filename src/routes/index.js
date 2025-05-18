import Dashboard from "pages/Dashboard/UserDashboard";
import FarmManagement from "pages/FarmManagement/FarmManagement";
import AddOrEditFarm from "pages/FarmManagement/AddOrEditFarm";
import FarmDetail from "pages/FarmManagement/FarmDetail";
import ManageUser from "pages/FarmManagement/ManageUser";
import ManageBeehiveLocation from "pages/FarmManagement/ManageBeehiveLocation";
import UserManagement from "pages/UserManagement/UserManagement";
import AddOrEditUser from "pages/UserManagement/AddOrEditUser";
import EditRole from "pages/UserManagement/EditRole";
import PollinationMap from "pages/PollinationMap/PollinationMap";
import PollinationMapDetail from "pages/PollinationMap/PollinationMapDetail";
import { routeContextType } from "utils/constants";
import ManageImages from "pages/FarmManagement/ManageImages";
import Settings from "pages/Settings/Settings";
import ActivityLogs from "pages/ActivityLogs/ActivityLogs";
import Training from "pages/Training/Training";
import AddTraining from "pages/Training/AddTraining";
import EditTraining from "pages/Training/EditTraining";
import ViewTraining from "pages/Training/ViewTraining";
import CameraManagement from "pages/Camera/CameraManagement";
import AddCameraManagement from "pages/Camera/AddCamera";
import AddCamera from "pages/Camera/AddCamera";
import EditCamera from "pages/Camera/EditCamera";
import PollinationTimeFilter from "pages/PollinationMap/PollinationTimeFilter";

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
    moduleName: "dashboard",
  },
  {
    path: "/farm_management",
    component: FarmManagement,
    moduleName: "farm_management",
  },
  {
    path: "/farm_management/add_farm",
    component: AddOrEditFarm,
    customProps: { context: routeContextType.add },
    moduleName: "farm_management",
  },
  {
    path: "/farm_management/edit_farm/:farmId",
    component: AddOrEditFarm,
    customProps: { context: routeContextType.edit },
    moduleName: "farm_management",
  },
  {
    path: "/farm_management/farm_detail/:farmId",
    component: FarmDetail,
    moduleName: "farm_management",
  },
  {
    path: "/farm_management/manage_user/:farmId",
    component: ManageUser,
    moduleName: "farm_management",
  },
  {
    path: "/farm_management/add_beehive_location/:farmId",
    component: ManageBeehiveLocation,
    customProps: { context: routeContextType.add },
    moduleName: "farm_management",
  },
  {
    path: "/farm_management/edit_beehive_location/:farmId/:beehiveLocationId",
    component: ManageBeehiveLocation,
    customProps: { context: routeContextType.edit },
    moduleName: "farm_management",
  },
  {
    path: "/pollination_map",
    component: PollinationMap,
    moduleName: "pollination_map",
  },
  {
    path: "/pollination_map/pollination_time_filter",
    component: PollinationTimeFilter,
    customProps: { context: routeContextType.edit },
    moduleName: "pollination_map",
    isDrawer: true,
  },
  {
    path: "/pollination_map/map_detail/:farmId",
    component: PollinationMapDetail,
    moduleName: "pollination_map",
  },
  {
    path: "/user_management",
    component: UserManagement,
    moduleName: "user_management",
  },
  {
    path: "/account_settings",
    component: Settings,
    moduleName: "account_settings",
  },
  {
    path: "/activity_logs",
    component: ActivityLogs,
    moduleName: "activity_logs",
  },
  {
    path: "/training",
    component: Training,
    moduleName: "training",
  },
  {
    path: "/training/add_training",
    component: AddTraining,
    customProps: { context: routeContextType.add },
    moduleName: "training",
    isDrawer: true,
  },
  {
    path: "/training/edit_training/:trainingId",
    component: EditTraining,
    customProps: { context: routeContextType.edit },
    moduleName: "training",
    isDrawer: true,
  },
  {
    path: "/training/view/:trainingId",
    component: ViewTraining,
    customProps: { context: routeContextType.add },
    moduleName: "training",
  },
  {
    path: "/camera_management",
    component: CameraManagement,
    moduleName: "camera_management",
  },
  {
    path: "/camera_management/add",
    component: AddCamera,
    moduleName: "camera_management",
  },
  {
    path: "/camera_management/edit/:cameraId",
    component: EditCamera,
    moduleName: "camera_management",
  },
  {
    path: "/user_management/add_user",
    component: AddOrEditUser,
    customProps: { context: routeContextType.add },
    moduleName: "user_management",
    isDrawer: true,
  },
  {
    path: "/user_management/edit_user/:userId",
    component: AddOrEditUser,
    customProps: { context: routeContextType.edit },
    moduleName: "user_management",
    isDrawer: true,
  },
  {
    path: "/user_management/edit_role/:roleName",
    component: EditRole,
    customProps: { context: routeContextType.edit },
    moduleName: "user_management",
    isDrawer: true,
  },
  {
    path: "/farm_management/manage_images",
    component: ManageImages,
    customProps: { context: routeContextType.edit },
    moduleName: "farm_management",
    isDrawer: true,
  },
];

export default routes;

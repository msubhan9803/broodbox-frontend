export const routeContextType = {
  add: "add",
  edit: "edit",
};

export const allRoles = {
  superAdmin: "Super Admin",
  businessAccount: "Business Account",
  farmManager: "Farm Manager",
  user: "User",
  contractor: "Contractor",
};

export const roleTypes = {
  superAdmin: "superAdmin",
  businessAccount: "businessAccount",
  farmManager: "farmManager",
  user: "user",
  contractor: "contractor",
};

export const controlTypes = {
  select: "select",
  comboBox: "comboBox",
  comboBox2: "comboBox2",
  multiComboBox: "multiComboBox",
  input: "input",
  phoneNumberInput: "phoneNumberInput",
  paragraph: "paragraph",
  render: "render",
};

export const userManagementComponentContextTypes = {
  farm_detail: "farm_detail",
  user_management: "user_management",
};

export const inputTypes = {
  password: "password",
};

export const modulesConfig = {
  dashboard: "dashboard",
  farm_management: "farm_management",
  user_management: "user_management",
  pollination_map: "pollination_map",
  account_settings: "account_settings",
  activity_logs: "activity_logs",
  training: "training",
  camera_management: "camera_management",
};

export const screenConfig = {
  dashboard: "dashboard",
  farm_management: "farm_management",
  add_farm: "add_farm",
  edit_farm: "edit_farm",
  farm_detail: "farm_detail",
  edit_beehive_location: "edit_beehive_location",
  manage_user: "manage_user",
  user_management: "user_management",
  add_user: "add_user",
  edit_user: "edit_user",
  edit_role: "edit_role",
  pollination_map: "pollination_map",
  account_settings: "account_settings",
  activity_logs: "activity_logs",
  training: "training",
  camera_management: "camera_management",
  add_training: "add_training",
  edit_training: "edit_training",
};

export const actionConfig = {
  add_farm: "add_farm",
  edit_farm: "edit_farm",
  delete_farm: "delete_farm",
  get_farm_detail: "get_farm_detail",
  manage_users: "manage_users",
  manage_beehive_locations: "manage_beehive_locations",
  manage_roles: "manage_roles",
  add_training: "add_training",
  edit_training: "edit_training",
};

export const mapContext = {
  farm_detail: "farm_detail",
  beeHive_Management: "beeHive_Management",
};

export const activityLogsActions = {
  farmCreated: "Farm Created",
  trainingCreated: "Training Created",
  userCreated: "User Created",
  beehiveCreated: "Beehive Created",
  farm_manager_assigned_to_farm: "Farm Manager Assigned",
  user_added_to_farm: "User Added to Farm",
  farmUpdated: "Farm Updated",
  beeHiveUpdate: "Beehive Updated",
  userActivated: "User Activated",
  userDeactivated: "User Deactivated",
  userApproval: "User Approval",
  userUpdated: "User Updated",
  cameraAdded: "Camera Added",
};

export const cameraStatus = {
  avaialabe: "available",
  occupied: "occupied",
  decommissioned: "decommissioned",
};

export const LOGIN_PAGE_REDIRECT_TYPES = {
  accountNoLongerExists: "accountNoLongerExists",
};


export const accountStatusTypes = {
  active: 'Activated',
  deactive: 'Deactivated',
  archived: 'Archived'
}
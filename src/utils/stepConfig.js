const welcomeStep = {
  element: ".selector1",
  title: "Welcome to Broodbox",
  intro: "We can quickly show you a few useful features. Take the guided tour",
  position: "right",
  tooltipClass: "myTooltipClass",
  highlightClass: "myHighlightClass",
};

const timezoneStep = {
  element: ".selector2",
  intro: "Select your time zone",
};

const businessAccFarmSelectionStep = {
  element: ".selector3",
  intro: "Select business account and farm correctly",
};

const pollinationStep = {
  element: ".selector4",
  intro: "View your farm’s pollination map from here",
};

const farmStep = {
  element: ".selector5",
  intro: "Add or edit your farm’s details here",
};

const userManagementStep = {
  element: ".selector6",
  intro: "Add or edit users here",
};

export const superAdminTourSteps = [
  welcomeStep,
  timezoneStep,
  businessAccFarmSelectionStep,
  pollinationStep,
  farmStep,
  userManagementStep,
];

export const businessAccTourSteps = [
  welcomeStep,
  timezoneStep,
  businessAccFarmSelectionStep,
  pollinationStep,
  farmStep,
  userManagementStep,
];

export const contractorTourSteps = [
  welcomeStep,
  timezoneStep,
  businessAccFarmSelectionStep,
  pollinationStep,
  farmStep,
];

export const userOrFarmManagerTourSteps = [
  welcomeStep,
  timezoneStep,
  businessAccFarmSelectionStep,
  pollinationStep,
  farmStep,
];

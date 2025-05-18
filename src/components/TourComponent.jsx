import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Steps } from "intro.js-react";
import {
  superAdminTourSteps,
  businessAccTourSteps,
  contractorTourSteps,
  userOrFarmManagerTourSteps,
} from "utils/stepConfig";
import "intro.js/introjs.css";
import { useUpdateUserById } from "hooks/useUser";
import { roleTypes } from "utils/constants";

const TourComponent = ({ userData }) => {
  const [isStepVisible, setIsStepVisible] = useState(false);
  const history = useHistory();
  const useUpdateUserByIdMutation = useUpdateUserById();

  useEffect(() => {
    if (userData && !userData.hasTakenTour) {
      setIsStepVisible(true);
    }
  }, [userData]);

  const _getStepsByRole = () => {
    switch (userData.role) {
      case roleTypes.superAdmin:
        return superAdminTourSteps;
      case roleTypes.businessAccount:
        return businessAccTourSteps;
      case roleTypes.contractor:
        return contractorTourSteps;

      default:
        return userOrFarmManagerTourSteps;
    }
  };

  const handleExit = () => {
    setIsStepVisible(false);

    useUpdateUserByIdMutation.mutate({
      hasTakenTour: true,
    });
  };

  const handleComplete = () => {
    useUpdateUserByIdMutation.mutate({
      hasTakenTour: true,
    });
  };

  const handleBeforeChange = async (nextStep) => {
    if (
      userData.role === roleTypes.superAdmin ||
      userData.role === roleTypes.businessAccount
    ) {
      return new Promise((resolve) => {
        if (nextStep === 3) {
          history.push("/pollination_map");
          setInterval(resolve, 300);
        } else if (nextStep === 4) {
          history.push("/farm_management");
          setInterval(resolve, 300);
        } else if (nextStep === 5) {
          history.push("/user_management");
          setInterval(resolve, 300);
        } else {
          resolve();
        }
      });
    } else {
      return new Promise((resolve) => {
        if (nextStep === 3) {
          history.push("/pollination_map");
          setInterval(resolve, 300);
        } else if (nextStep === 4) {
          history.push("/farm_management");
          setInterval(resolve, 300);
        } else {
          resolve();
        }
      });
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <Steps
      enabled={isStepVisible}
      steps={userData && userData.role ? _getStepsByRole() : []}
      initialStep={0}
      onExit={handleExit}
      // onBeforeExit={() => false}
      onComplete={handleComplete}
      onBeforeChange={handleBeforeChange}
      options={{
        nextLabel: "Next",
        prevLabel: "Back",
        doneLabel: "Done",
      }}
    />
  );
};

export default TourComponent;

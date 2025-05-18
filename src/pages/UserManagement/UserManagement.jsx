import React, { useState, useEffect } from "react";
import TopHeading from "components/TopHeading";
import Tabs from "components/common/Tabs";
import UsersTab from "components/userManagement/UserManagement";
import RolesTab from "components/userManagement/RolesManagement";
import { userManagementComponentContextTypes } from "utils/constants";

const tabs = [
  {
    label: "Users",
  },
  {
    label: "Roles / Privileges",
  },
];

const UserManagement = ({ farmId }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const renderTabContent = () => {
    switch (currentTab) {
      case 1:
        return <RolesTab />;

      default:
        return (
          <UsersTab
            farmId={farmId}
            context={userManagementComponentContextTypes.user_management}
          />
        );
    }
  };

  return (
    <>
      <TopHeading mainHeading={"User Management"} />
      <Tabs tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="mt-[32px]">{renderTabContent()}</div>
    </>
  );
};

export default UserManagement;

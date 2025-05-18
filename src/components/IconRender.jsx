import React from "react";
import { MdDashboard, MdMap, MdPerson, MdShowChart, MdSettings, MdTimer, MdSchool, MdVideocam } from "react-icons/md";

export default function IconRender({ iconName }) {
  const iconMap = {
    dashboard: <MdDashboard className="w-[24px] h-[24px]" />,
    farm_management: <MdMap className="w-[24px] h-[24px]" />,
    user_management: <MdPerson className="w-[24px] h-[24px]" />,
    pollination_map: <MdShowChart className="w-[24px] h-[24px]" />,
    account_settings: <MdSettings className="w-[24px] h-[24px]" />,
    activity_logs: <MdTimer className="w-[24px] h-[24px]" />,
    training: <MdSchool className="w-[24px] h-[24px]" />,
    camera_management: <MdVideocam className="w-[24px] h-[24px]" />,
  };

  const iconToRender = iconMap[iconName];

  if (!iconToRender) {
    return <div>Icon not found</div>;
  }

  return iconToRender;
}

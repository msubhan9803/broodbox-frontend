import React, { createContext, useState } from "react";

// Create a context
export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [businessAccountRef, setBusinessAccountRef] = useState("");
  const [totalActiveFrames, setTotalActiveFrames] = useState(null);
  const [farmId, setFarmId] = useState("");
  const [areaCodes, setAreaCodes] = useState(null);
  const [locationCodes, setLocationCode] = useState(null);

  const value = {
    businessAccountRef,
    setBusinessAccountRef,
    farmId,
    setFarmId,
    totalActiveFrames,
    setTotalActiveFrames,
    areaCodes,
    setAreaCodes,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

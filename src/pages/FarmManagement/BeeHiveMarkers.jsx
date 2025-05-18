import React from "react";
import { Marker } from "@react-google-maps/api";
import { useHistory, useParams } from "react-router-dom";
import { routeContextType, mapContext } from "utils/constants";

const BeehiveMarkers = ({ beehiveData, isDefaultIcon, context }) => {
  const history = useHistory();
  const params = useParams();
  const { farmId } = params;

  const handleMarkerClick = (beehive) => {
    // Navigate to the edit page with the entire state.location object in the location state
    history.push({
      pathname: `/farm_management/edit_beehive_location/${farmId}/${beehive.location_code}`,
      state: {
        beehives: [...beehiveData],
        ...beehive,
      },
    });
  };

  return beehiveData.map((beehive, index) => {
    const { latitude, longitude } = beehive;
    const position = { lat: latitude, lng: longitude };

    return (
      <Marker
        key={index}
        position={position}
        onClick={
          context === mapContext.beeHive_Management
            ? "undefined"
            : () => handleMarkerClick(beehive)
        }
        icon={
          isDefaultIcon
            ? undefined
            : {
                url: "/marker-purple.png",
                scaledSize: new window.google.maps.Size(30, 45),
              }
        }
      />
    );
  });
};

export default BeehiveMarkers;

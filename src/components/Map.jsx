import React, { useState, useEffect, useCallback } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
} from "@react-google-maps/api";
import PropTypes from "prop-types";
import Places from "./Places";
import BeehiveMarkers from "pages/FarmManagement/BeeHiveMarkers";

const containerStyle = {
  width: "100%",
  border: "1px solid #D0D5D7",
  borderRadius: "5px",
};

const Map = ({
  context,
  isDefaultIcon,
  beehiveData,
  height = "600px",
  beehiveLocationCoord,
  handleBeehiveLocation,
  boundaries,
  permissions,
  setBoundaries,
  handleClearBoundaries,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    googleMapsApiKey: 'AIzaSyBYoZZy6mm3XMvpbz5voQClLRzQ0D5Ln_E',
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 43.45, lng: -80.49 });
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const options = {
    // mapId: process.env.REACT_APP_MAP_ID,
    mapId: 'b76237846679b9da',
    scrollwheel: !!permissions.isScrollwheelEnabled,
  };

  const handleAddBoundary = (e) => {
    const newBoundary = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setBoundaries([...boundaries, newBoundary]);
  };

  const handleAddBeehiveLocation = (e) => {
    const newBoundary = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    handleBeehiveLocation(newBoundary);
  };

  const onMarkerDragEnd = (index) => (e) => {
    const updatedBoundaries = boundaries.map((boundary, i) => {
      if (i === index) {
        return { lat: e.latLng.lat(), lng: e.latLng.lng() };
      }
      return boundary;
    });
    setBoundaries(updatedBoundaries);
  };

  const handleMarkerClick = (index) => {
    setSelectedMarker(boundaries[index]);
    setSelectedMarkerIndex(index);
  };

  const onBeehiveLocMarkerDragEnd = (e) => {
    const newBoundary = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    handleBeehiveLocation(newBoundary);
  };

  const deleteSelectedMarker = (e) => {
    e.preventDefault();

    if (selectedMarkerIndex !== null) {
      const updatedBoundaries = boundaries.filter(
        (_, i) => i !== selectedMarkerIndex
      );
      setBoundaries(updatedBoundaries);
      setSelectedMarker(null);
      setSelectedMarkerIndex(null);
    }
  };

  const handleOfficeSelect = (position) => {
    setMapCenter(position);
  };

  const onLoad = useCallback((map) => setMap(map), []);

  const getMapOnClickHandler = (e) => {
    if (permissions.isEditable) {
      if (permissions.isBeehiveLocationEditable) {
        handleAddBeehiveLocation(e);
      } else {
        handleAddBoundary(e);
      }
    } else {
      return () => {};
    }
  };

  useEffect(() => {
    if (map) {
      if (boundaries.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        boundaries.forEach((marker) => {
          bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
        });
        map.fitBounds(bounds);
      } else {
        map.setCenter(mapCenter);
        map.setZoom(zoom);
      }
    }
  }, [map, boundaries, mapCenter, zoom, beehiveData]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative">
      {permissions.isEditable && !permissions.isBeehiveLocationEditable && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-[99999]">
          <Places setPlace={handleOfficeSelect} setZoom={setZoom} />
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{
          ...containerStyle,
          height,
        }}
        center={mapCenter}
        zoom={10}
        onClick={getMapOnClickHandler}
        mapContainerClassName="map-container"
        options={options}
        onLoad={onLoad}
      >
        {beehiveData && (
          <BeehiveMarkers
            beehiveData={beehiveData}
            isDefaultIcon={isDefaultIcon}
            context={context}
          />
        )}
        {!permissions.isBeehiveLocationEditable &&
          boundaries.map((boundary, index) => (
            <Marker
              key={index}
              position={boundary}
              draggable={
                permissions.isEditable && permissions.isFarmBoundaryEditable
              }
              onDragEnd={onMarkerDragEnd(index)}
              onClick={() => handleMarkerClick(index)}
              icon={
                selectedMarker === boundary && permissions.isEditable
                  ? {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "orange",
                      fillOpacity: 1,
                      strokeColor: "white",
                      strokeWeight: 2,
                    }
                  : undefined
              }
            />
          ))}

        {permissions.isBeehiveLocationEditable && (
          <Marker
            position={beehiveLocationCoord}
            draggable={
              permissions.isEditable && permissions.isBeehiveLocationEditable
            }
            onDragEnd={onBeehiveLocMarkerDragEnd}
            icon={{
              // url: '/map-marker.svg',
              url: "/marker-purple.png",
              scaledSize: new window.google.maps.Size(30, 45),
            }}
          />
        )}

        {boundaries.length > 1 && (
          <Polygon
            path={boundaries}
            onClick={(e) => {
              if (
                permissions.isEditable &&
                permissions.isBeehiveLocationEditable
              ) {
                handleAddBeehiveLocation({
                  latLng: {
                    lat: () => e.latLng.lat(),
                    lng: () => e.latLng.lng(),
                  },
                });
              }
            }}
            options={{
              fillColor: "#D2ABF7",
              fillOpacity: 0.5,
              strokeColor: "#5604A9",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>

      {permissions.isEditable && !permissions.isBeehiveLocationEditable && (
        <div className="absolute flex z-[99] bottom-1 items-end py-4 px-2 gap-2 h-fit">
          <button
            className="bg-white hover:bg-[#ebebeb] border-0 m-0 px-4 relative cursor-pointer select-none overflow-hidden text-center h-10 text-black text-lg shadow min-w-[36px] font-medium"
            onClick={handleClearBoundaries}
          >
            Clear
          </button>
          <button
            className="bg-white hover:bg-[#ebebeb] border-0 m-0 px-4 relative cursor-pointer select-none overflow-hidden text-center h-10 text-black text-lg shadow min-w-[36px] font-medium"
            onClick={(e) => deleteSelectedMarker(e)}
          >
            Delete a Marker
          </button>
        </div>
      )}
    </div>
  );
};

Map.propTypes = {
  boundaries: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
  permissions: PropTypes.shape({
    isEditable: PropTypes.bool.isRequired,
    isScrollwheelEnabled: PropTypes.bool.isRequired,
    isFarmBoundaryEditable: PropTypes.bool.isRequired,
    isBeehiveLocationEditable: PropTypes.bool.isRequired,
  }).isRequired,
  setBoundaries: PropTypes.func.isRequired,
  handleClearBoundaries: PropTypes.func.isRequired,
  defaultCenter: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default Map;

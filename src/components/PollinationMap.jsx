import React from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
  LayerGroup,
  LayersControl,
} from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("assets/images/marker-purple.png"),
  iconUrl: require("assets/images/marker-purple.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = ({ state, activeTab, farmDetailData }) => {
  const position = [-35.09083843362438, 143.2762670516968];

  const getLocationInfo = (lat, lng) => {
    const beehiveLocations = farmDetailData.beehiveLocations;

    const location = beehiveLocations.find(loc => 
      Math.abs(loc.latitude - lat) < 0.001 && Math.abs(loc.longitude - lng) < 0.001
    );

    if (location) {
      return `Area Code: ${location.area_code}, Location Code: ${location.location_code}`;
    } else {
      return "Location information not found";
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      minZoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <LayersControl>
        <LayersControl.BaseLayer name="Google Map">

          <TileLayer
            attribution="Map"
            url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Google Map Satellite">
          <LayerGroup>
            <TileLayer
              attribution="Satellite"
              url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
            />
            <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
          </LayerGroup>
        </LayersControl.BaseLayer>
      </LayersControl>

      {state && (
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={
            activeTab === "spatial"
              ? JSON.parse(state.spatial_map)
              : JSON.parse(state.final_map)
          }
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => parseFloat(m[2])}
          useLocalExtrema={false}
          max={1}
        />
      )}

      {state?.hive_locations &&
        JSON.parse(state.hive_locations).map((location, index) => (
          <Marker position={[location[0], location[1]]} key={index}>
            <Popup>{getLocationInfo(location[0], location[1])}</Popup>
          </Marker>
        ))}

      <Polygon
        positions={farmDetailData?.boundaries?.map((boundary) => [
          boundary.lat,
          boundary.lng,
        ])}
        color="#5604A9"
      />
    </MapContainer>
  );
};

export default MapComponent;

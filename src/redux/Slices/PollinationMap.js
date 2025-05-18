import { createSlice } from "@reduxjs/toolkit";

export const pollinationMapState = {
  farmId: "",
  spatial_map: [],
  final_map: [],
  businessAccountRef: "",
  title: "",
  farmManagerRef: "",
  createdBy: "",
  isPollinationMapViewable: "",
  boundaries: [],
  beehiveLocations: [],
};

export const pollinationMapSlice = createSlice({
  name: "pollinationMap",
  initialState: {
    fetchedPollinationAvailable: null,
    maps: []
  },
  reducers: {
    insertPollinationMap: (state, action) => {
      const exists = state.maps.some((map) => map.farmId === action.payload.farmId);
      if (!exists) {
        state.maps.push(action.payload);
      }
    },
    insertNewFetchedMap: (state, action) => {
      state.fetchedPollinationAvailable = action.payload.farmId;
    },
    resetFetchedPollinationState: (state, action) => {
      state.fetchedPollinationAvailable = null;
    },
    getPollinationMapByFarmId: (state, action) => {
      return state.maps.find((map) => map.farmId === action.payload.farmId) || null;
    },
    updatePollinationMap: (state, action) => {
      const { farmId, changes } = action.payload;
      const index = state.maps.findIndex((map) => map.farmId === farmId);
      if (index !== -1) {
        state[index] = { ...state[index], ...changes };
      }
    },
    removePollinationMap: (state, action) => {
      return state.maps.filter((map) => map.farmId !== action.payload.farmId);
    },
  },
});

export const {
  insertPollinationMap,
  insertNewFetchedMap,
  getPollinationMapByFarmId,
  updatePollinationMap,
  removePollinationMap,
  resetFetchedPollinationState,
} = pollinationMapSlice.actions;
export default pollinationMapSlice.reducer;

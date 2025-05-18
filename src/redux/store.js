import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

import userReducer from "./Slices/UserSlice";
import createFarmReducer from "./Slices/AddFarmSlice";
import beeHiveFormReducer from "./Slices/BeeHiveFormSlice";
import rankingReducer from "./Slices/RankingSlice";
import analyticsReducer from "./Slices/AnalyticsSlice";
import confidenceCardListReducer from "./Slices/ConfidenceCardListSlice";
import agGridFormReducer from "./Slices/AGGridFormSlice";
import PollinationMapReducer from "./Slices/PollinationMap";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  pollinationMap: PollinationMapReducer,
  beeHiveForm: beeHiveFormReducer,
  ranking: rankingReducer,
  analytics: analyticsReducer,
  confidenceCardList: confidenceCardListReducer,
  agGridForm: agGridFormReducer,
  createFarm: createFarmReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

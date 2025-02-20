import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import funnelSlice from './slices/funnelSlice'
import paginationSlice from "./slices/paginationSlice";
import activeTabSlice from "./slices/activeTabSlice";
import filteredLeadsSlice from "./slices/prevFilteredLeadsSlice";

const reducers = combineReducers({
  login: loginSlice,
  funnel: funnelSlice,
  pagination : paginationSlice,
  tab : activeTabSlice,
  prevFilteredLeads: filteredLeadsSlice,
});

const persistConfig = {
  key: "root",
  storage: storage,
  
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
setupListeners(store.dispatch);
export default store;
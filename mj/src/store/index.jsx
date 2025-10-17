import { configureStore } from "@reduxjs/toolkit";
import { mngReducer } from "../pages/Manage/mngSlice";
import { authReducer } from "../pages/AuthMngSys/authSlice";

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: {
    mng: mngReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});

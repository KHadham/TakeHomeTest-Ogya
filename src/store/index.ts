import { configureStore } from "@reduxjs/toolkit";
import { githubApiSlice } from "./slices/githubSlice"; // Import the new API slice

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [githubApiSlice.reducerPath]: githubApiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

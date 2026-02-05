import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { storeApi } from './api/storeApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Add the auth slice reducer
    auth: authReducer,

    // Add the RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },

  // Add the RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, storeApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

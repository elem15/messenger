import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { messangerApi } from './messanger/messangerApi';
import { usersApi } from './users/usersApi';

const store = configureStore({
  reducer: {
    [messangerApi.reducerPath]: messangerApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    messangerApi.middleware,
    usersApi.middleware
  ),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

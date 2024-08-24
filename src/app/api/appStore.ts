import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { messengerApi } from '@/app/api/messenger/messengerApi';
import { usersApi } from './users/usersApi';
import { dialogSlice } from "@/app/services/dialog-slice";

const store = configureStore({
  reducer: {
    [messengerApi.reducerPath]: messengerApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [dialogSlice.name]: dialogSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    messengerApi.middleware,
    usersApi.middleware
  ),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

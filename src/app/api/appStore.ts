import { configureStore } from '@reduxjs/toolkit';
import { messengerApi } from '@/app/api/messenger/messengerApi';
import { usersApi } from './users/usersApi';

const store = configureStore({
  reducer: {
    [messengerApi.reducerPath]: messengerApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    messengerApi.middleware,
    usersApi.middleware
  ),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

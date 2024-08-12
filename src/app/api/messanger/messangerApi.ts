import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import { IMessageInfo } from '../../../types/messanger';

export const messangerApi = createApi({
  reducerPath: 'messanger',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['messanger'],
  endpoints: (builder) => ({
    getMessenger: builder.query<IMessageInfo, any>({
      query: ({accessToken}) => {
        return {
          method: 'GET',
          url: `/messanger`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          credentials: 'include',
        };
      },
    }),
    getMessengerById: builder.query<any, any>({
      query: ({accessToken, userId}) => {
        return {
          method: 'GET',
          url: `/messanger/${userId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          credentials: 'include',
        };
      },
    }),
  }),
});

export const { useGetMessengerQuery, useGetMessengerByIdQuery } = messangerApi;

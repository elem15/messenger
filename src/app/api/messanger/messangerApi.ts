import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import { IMessageInfo } from '../../../types/messanger';

export const messangerApi = createApi({
  reducerPath: 'messanger',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['messanger'],
  endpoints: (builder) => ({
    getMessenger: builder.query<IMessageInfo, { searchName: string }>({
      query: ({ searchName }) => {
        const accessToken = localStorage.getItem('token');
        return {
          method: 'GET',
          url: `/messanger?search=${searchName}`,
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

export const { useGetMessengerQuery } = messangerApi;

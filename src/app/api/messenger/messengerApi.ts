import { ResponseDialogsByUser } from '@/types/messenger';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import { IMessageInfo, IMessageType } from '@/types/messenger';

export const messengerApi = createApi({
  reducerPath: 'messenger-remote',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['messenger-remote'],
  endpoints: (builder) => ({
    getMessenger: builder.query<IMessageInfo, any>({
      query: ({accessToken}) => {
        return {
          method: 'GET',
          url: `/messanger?pageSize=20`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          credentials: 'include',
        };
      },
      providesTags: ['messenger-remote'],
    }),
    onReadMessage: builder.mutation<any, any>({
      query: ({accessToken, body}) => {
        return {
          method: 'PUT',
          url: `/messanger`,
          body: body,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          credentials: 'include',
        };
      },
      invalidatesTags: ['messenger-remote'],
    }),
    getMessengerById: builder.query<IMessageType[], {accessToken: string | null, userId: number}>({
      query: ({accessToken, userId}) => {
        return {
          method: 'GET',
          url: `/messanger/${userId}?pageSize=20`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          credentials: 'include',
        };
      },
      transformResponse: (res: ResponseDialogsByUser): IMessageType[] => {
        return res.items.map((item: IMessageType) => item)
      },
      providesTags: ['messenger-remote'],
    }),
  }),
});

export const { useLazyGetMessengerQuery, useLazyGetMessengerByIdQuery, useOnReadMessageMutation } = messengerApi;

import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users'],
  endpoints: builder => ({
    getUsersName: builder.query<
    IUser[],
      { name: string | null; accessToken: string | undefined }
    >({
      query: ({ name, accessToken }) => ({
        method: 'GET',
        url: `/users/?search=${name}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      }),
      transformResponse: (res: ISearchUsers): IUser[] => {
        return res.items.map(item => {
          return {id: item.id, firstName: item.firstName, lastName: item.lastName, avatars: item.avatars}
        })
      },
      providesTags: ['Users'],
    }),
    getUserName: builder.query<
    UserName,
      { name: string | null; accessToken: string | undefined }
    >({
      query: ({ name, accessToken }) => ({
        method: 'GET',
        url: `/users/${name}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      }),
      transformResponse: (res: UserName) => ({firstName: res.firstName, lastName: res.lastName}),
      providesTags: ['Users'],
    }),
  }),
})

export const { useGetUsersNameQuery, useGetUserNameQuery } = usersApi
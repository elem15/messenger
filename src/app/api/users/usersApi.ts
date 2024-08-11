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
          console.log(item)
          return {id: item.id, firstName: item.firstName, lastName: item.lastName, avatars: item.avatars}
        })
      },
      providesTags: ['Users'],
    }),
  }),
})

export const { useGetUsersNameQuery } = usersApi
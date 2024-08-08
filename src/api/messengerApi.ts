import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const messengerApi = createApi({
  reducerPath: 'messenger',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://messenger.incta.online/api/v1' }),
  tagTypes: ['messenger'],
  endpoints: builder => ({
    getMessenger: builder.query({
      query: () => {
        return {
          method: 'GET',
          url: `/messenger`,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      }
    })
  })
})

export const { useGetMessengerQuery } = messengerApi
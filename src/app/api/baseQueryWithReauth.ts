import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({ baseUrl: 'https://inctagram.work/api/v1' })

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta> =
      await baseQuery(
        { url: '/auth/update-tokens', method: 'POST', credentials: 'include' },
        api,
        extraOptions
      )

    if (refreshResult.data) {
      const data = refreshResult.data as { accessToken: string }

      localStorage.setItem('token', data.accessToken)
      result = await baseQuery(args, api, extraOptions)
    } else {
      localStorage.removeItem('token')
    }
  }

  return result
}

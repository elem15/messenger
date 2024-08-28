import {createSlice} from "@reduxjs/toolkit";

type initialStateProps = {
  accessToken: string
}
const initialState: initialStateProps = {
  accessToken: '',
}
export const authSlice = createSlice({
  initialState,
  name: "authSlice",
  reducers: {
    setToken: (state, { payload: { accessToken } }) => {
      state.accessToken = accessToken
      localStorage.setItem('token-remote', accessToken)
    }
  }
})

export const { setToken } = authSlice.actions
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {IMessageType} from "@/types/messenger";

type InitType = {
  dialog: IMessageType[]
}

const initialState: InitType = {
  dialog: [],
}

export const dialogSlice = createSlice({
  initialState,
  name: 'postSlice',
  reducers: {
    setDialog: (state, action: PayloadAction<IMessageType[]>) => {
      state.dialog = action.payload
    },
  },
})
export const { setDialog } = dialogSlice.actions

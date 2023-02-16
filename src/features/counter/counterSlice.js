import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: 0,
}
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrementAll: (state) => {
      state.value =0
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      // console.log({state})
      console.log({action})
      state.value += 1
    },
  },
})

export const { increment, decrement, incrementByAmount,decrementAll } = counterSlice.actions
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
export default counterSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  exchangeRate: "39",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    isAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setExchangeR: (state, action) => {
      state.exchangeRate = action.payload;
    },
  },
});

export const { isAuth, setExchangeR } = userSlice.actions;

export default userSlice.reducer;

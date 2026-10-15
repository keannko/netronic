import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModal: false,
  isConfirmModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    isModal: (state, action) => {
      state.isModal = action.payload;
    },
    isConfirmModal: (state, action) => {
      state.isConfirmModal = action.payload;
    },
  },
});

export const { isModal, isConfirmModal } = modalSlice.actions;

export default modalSlice.reducer;

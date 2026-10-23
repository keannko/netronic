import { configureStore } from '@reduxjs/toolkit';
import modalSlice from './slices/modalSlice';
import userSlice from './slices/userSlice';


const store = configureStore({
  reducer: {
    user: userSlice,
    modal: modalSlice
  }
});

export default store;

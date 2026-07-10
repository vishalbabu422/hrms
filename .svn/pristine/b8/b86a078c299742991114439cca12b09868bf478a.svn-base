import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "./store/slices/authSlice"; // adjust path if needed

// 🟢 CoreUI UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarShow: true,
    theme: "light",
  },
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { set } = uiSlice.actions;

// 🟢 Configure Store (Thunk included automatically)
const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: authReducer,
  },
});

export default store;

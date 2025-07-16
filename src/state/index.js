import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "./services/userApi";

const initialState = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  userData: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
    extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, action) => {
        state.userData = action.payload; // 👈 Auto-set userData when getUser succeeds
      }
    );
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode, setUserData } =
  globalSlice.actions;

export default globalSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    lastParams: null,
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.data = action.payload.data;
      state.lastParams = action.payload.params;
    },
    clearDashboardData: (state) => {
      state.data = null;
      state.lastParams = null;
    },
  },
});

export const { setDashboardData, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;

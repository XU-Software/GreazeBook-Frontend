import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  severity: "success",
  message: "",
};

// snackbarSlice.js
const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setShowSnackbar: (state, action) => {
      state.show = true;
      state.severity = action.payload.severity || "success";
      state.message = action.payload.message;
    },
    setHideSnackbar: (state) => {
      state.show = false;
    },
  },
});

export const { setShowSnackbar, setHideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { productsApi } from "./services/productsApi";

const initialState = {
  productsToRestockCount: 0,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsToRestockCount: (state, action) => {
      state.productsToRestockCount = action.payload ?? 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      productsApi.endpoints.getProductsToRestock.matchFulfilled,
      (state, action) => {
        state.productsToRestockCount = action.payload?.data ?? 0; // 👈 Auto-set productsToRestockCount when getProductsToRestock succeeds
      }
    );
  },
});

export const { setProductsToRestockCount } = productsSlice.actions;

export default productsSlice.reducer;

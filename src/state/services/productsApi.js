import { api } from "../api";

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/product/all`,
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Products", id: "LIST" },
              ...result?.data.map((p) => ({
                type: "Product",
                id: p.productId,
              })),
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductsToRestock: build.query({
      query: () => ({
        url: `/product/restock-count`,
      }),
      providesTags: [{ type: "ProductsToRestock", id: "LIST" }],
    }),
    deleteProducts: build.mutation({
      query: (products) => ({
        url: `/product/delete-products`,
        method: "POST",
        body: { products },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, products) => [
        { type: "Products", id: "LIST" },
        { type: "ProductsToRestock", id: "LIST" },
        ...products.map((productId) => ({ type: "Product", id: productId })),
      ],
    }),
    addSingleProduct: build.mutation({
      query: (product) => ({
        url: `/product/add/single-product`,
        method: "POST",
        body: { product },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        { type: "Products", id: "LIST" },
        { type: "ProductsToRestock", id: "LIST" },
      ],
    }),
    importProductsExcel: build.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/product/import-data`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [
        { type: "Products", id: "LIST" },
        { type: "ProductsToRestock", id: "LIST" },
      ],
    }),
    getProductInformation: build.query({
      query: (productId) => ({
        url: `/product/${productId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),
    getStockHistory: build.query({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `/product/${productId}/stock-history`,
        params: { page, limit },
      }),
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              { type: "StockHistoryList", id: arg.productId },
              ...result.data.map((sh) => ({
                type: "StockHistoryItem",
                id: sh.stockHistoryId,
              })),
            ]
          : [{ type: "StockHistoryList", id: arg.productId }],
    }),
    updateProductInfo: build.mutation({
      query: ({ productId, productInfoData }) => ({
        url: `/product/${productId}/update`,
        method: "PATCH",
        body: { productInfoData },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: "LIST" },
        { type: "Product", id: arg.productId },
      ],
    }),
    addProductStock: build.mutation({
      query: ({ productId, productStockInfo }) => ({
        url: `/product/${productId}/add-stock`,
        method: "PATCH",
        body: { productStockInfo },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: "LIST" },
        { type: "ProductsToRestock", id: "LIST" },
        { type: "Product", id: arg.productId },
        { type: "StockHistoryList", id: arg.productId },
      ],
    }),
    removeProductStock: build.mutation({
      query: ({ productId, productStockInfo }) => ({
        url: `/product/${productId}/remove-stock`,
        method: "PATCH",
        body: { productStockInfo },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: "LIST" },
        { type: "ProductsToRestock", id: "LIST" },
        { type: "Product", id: arg.productId },
        { type: "StockHistoryList", id: arg.productId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsToRestockQuery,
  useDeleteProductsMutation,
  useAddSingleProductMutation,
  useImportProductsExcelMutation,
  useGetProductInformationQuery,
  useGetStockHistoryQuery,
  useUpdateProductInfoMutation,
  useAddProductStockMutation,
  useRemoveProductStockMutation,
} = productsApi;

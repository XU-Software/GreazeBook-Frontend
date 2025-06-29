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
      invalidatesTags: [{ type: "Products", id: "LIST" }],
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
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useDeleteProductsMutation,
  useAddSingleProductMutation,
  useImportProductsExcelMutation,
} = productsApi;

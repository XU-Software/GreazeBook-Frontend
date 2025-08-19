import { api } from "../api";

const salesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSales: build.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortOrder = "desc",
        startDate,
        endDate,
      }) => ({
        url: `/sales/all`,
        params: {
          page,
          limit,
          search,
          sortOrder,
          startDate,
          endDate,
        },
      }),
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              { type: "Sales", id: "LIST" },
              ...result?.data.map((sale) => ({
                type: "Sale",
                id: sale.saleId,
              })),
            ]
          : [{ type: "Sales", id: "LIST" }],
    }),
  }),
});

export const { useGetSalesQuery } = salesApi;

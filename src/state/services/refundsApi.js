import { api } from "../api";

const refundsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRefunds: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/refund/all`,
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              { type: "Refunds", id: "LIST" },
              ...result?.data.map((refund) => ({
                type: "Refund",
                id: refund.refundId,
              })),
            ]
          : [{ type: "Refunds", id: "LIST" }],
    }),
  }),
});

export const { useGetRefundsQuery } = refundsApi;

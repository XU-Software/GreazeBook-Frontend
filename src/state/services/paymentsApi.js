import { api } from "../api";

const paymentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPayments: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/payment/all`,
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
              { type: "Payments", id: "LIST" },
              ...result?.data.map((payment) => ({
                type: "Payment",
                id: payment.paymentId,
              })),
            ]
          : [{ type: "Payments", id: "LIST" }],
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentsApi;

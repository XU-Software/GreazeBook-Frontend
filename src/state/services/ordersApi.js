import { api } from "../api";

const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/order/all`,
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
              { type: "Orders", id: "LIST" },
              ...result?.data.map((order) => ({
                type: "Order",
                id: order.orderId,
              })),
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const { useGetOrdersQuery } = ordersApi;

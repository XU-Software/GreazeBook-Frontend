import { api } from "../api";

export const bookingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    submitBooking: build.mutation({
      query: ({ bookingInformation, account, orders }) => ({
        url: `/booking/new`,
        method: "POST",
        body: { bookingInformation, account, orders },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Bookings", id: "LIST" },
        { type: "Accounts", id: "LIST" },
        { type: "Account", id: arg.account.accountId },
        { type: "Orders", id: "LIST" },
      ],
    }),
    getBookings: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/booking/all`,
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
              { type: "Bookings", id: "LIST" },
              ...result?.data.map((booking) => ({
                type: "Booking",
                id: booking.bookingId,
              })),
            ]
          : [{ type: "Bookings", id: "LIST" }],
    }),
    deleteBookings: build.mutation({
      query: (bookings) => ({
        url: `/booking/delete-bookings`,
        method: "POST",
        body: { bookings },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Bookings", id: "LIST" },
        ...arg.map((bookingId) => ({ type: "Booking", id: bookingId })),
      ],
    }),
    getSingleBooking: build.query({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Booking", id: arg }],
    }),
    updatePendingBooking: build.mutation({
      query: ({ bookingId, booking }) => ({
        url: `/booking/${bookingId}/update`,
        method: "POST",
        body: { booking },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Bookings", id: "LIST" },
        { type: "Booking", id: arg.bookingId },
      ],
    }),
    updatePendingOrders: build.mutation({
      query: ({ bookingId, ordersToUpdate, orderIdsToDelete }) => ({
        url: `/booking/${bookingId}/orders`,
        method: "PATCH",
        body: { ordersToUpdate, orderIdsToDelete },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "Bookings", id: "LIST" },
          { type: "Booking", id: arg.bookingId },
          { type: "Orders", id: "LIST" },
        ];

        const allOrderIds = [
          ...(arg.orderIdsToDelete || []),
          ...(arg.ordersToUpdate?.map((o) => o.orderId) || []),
        ];

        const uniqueOrderIds = Array.from(new Set(allOrderIds));

        tags.push(
          ...uniqueOrderIds.map((orderId) => ({ type: "Order", id: orderId }))
        );

        return tags;
      },
    }),
    addPendingOrders: build.mutation({
      query: ({ bookingId, order }) => ({
        url: `/booking/${bookingId}/orders`,
        method: "POST",
        body: { order },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Bookings", id: "LIST" },
        { type: "Booking", id: arg.bookingId },
        { type: "Orders", id: "LIST" },
      ],
    }),
    addBookingNote: build.mutation({
      query: ({ bookingId, note }) => ({
        url: `/booking/${bookingId}/notes`,
        method: "POST",
        body: { note },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Booking", id: arg.bookingId },
      ],
    }),
    approveBooking: build.mutation({
      query: ({ bookingId, salesInvoiceNumber }) => ({
        url: `/invoice/${bookingId}/approve`,
        method: "POST",
        body: { salesInvoiceNumber },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Bookings", id: "LIST" },
        { type: "Booking", id: arg.bookingId },
        { type: "Invoices", id: "LIST" },
        { type: "Sales", id: "LIST" },
        { type: "AccountsReceivables", id: "LIST" },
        { type: "Products", id: "LIST" },
        ...result?.affectedProductIds.map((productId) => ({
          type: "Product",
          id: productId,
        })),
      ],
    }),
    deletePendingBooking: build.mutation({
      query: ({ bookingId }) => ({
        url: `/booking/${bookingId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Bookings", id: "LIST" },
        { type: "Booking", id: arg.bookingId },
      ],
    }),
  }),
});

export const {
  useSubmitBookingMutation,
  useGetBookingsQuery,
  useDeleteBookingsMutation,
  useGetSingleBookingQuery,
  useUpdatePendingBookingMutation,
  useUpdatePendingOrdersMutation,
  useAddPendingOrdersMutation,
  useAddBookingNoteMutation,
  useApproveBookingMutation,
  useDeletePendingBookingMutation,
} = bookingsApi;

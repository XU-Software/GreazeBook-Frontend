import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: [
    "User",
    "CompanyInvites",
    "CompanyUsers",
    "Accounts",
    "Account",
    "Products",
    "Bookings",
    "Booking",
    "Invoices",
    "Invoice",
    "AccountsReceivables",
    "AccountsReceivable",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => "/company/user-data",
      providesTags: ["User"],
    }),
    getCompanyInvites: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: "/company/invites",
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: ["CompanyInvites"],
    }),
    cancelCompanyInvite: build.mutation({
      query: (inviteId) => ({
        url: `/company/invitations/${inviteId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["CompanyInvites"],
    }),
    getCompanyUsers: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: "/company/users",
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: ["CompanyUsers"],
    }),
    cancelUserAccess: build.mutation({
      query: (userId) => ({
        url: `/company/users/${userId}/delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CompanyUsers"],
    }),
    inviteCompanyUser: build.mutation({
      query: ({ email, role }) => ({
        url: `/company/invite-user`,
        method: "POST",
        body: { email, role },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["CompanyInvites"],
    }),
    getAccounts: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/account/all`,
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: ["Accounts"],
    }),
    deleteAccounts: build.mutation({
      query: (accounts) => ({
        url: `/account/delete-accounts`,
        method: "POST",
        body: { accounts },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Accounts"],
    }),
    addSingleAccount: build.mutation({
      query: (account) => ({
        url: `/account/add/single-account`,
        method: "POST",
        body: { account },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Accounts"],
    }),
    importAccountsExcel: build.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/account/import-data`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Accounts"],
    }),
    getSingleAccount: build.query({
      query: (accountId) => ({
        url: `/account/${accountId}`,
      }),
      providesTags: ["Account"],
    }),
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
      providesTags: ["Products"],
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
      invalidatesTags: ["Products"],
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
      invalidatesTags: ["Products"],
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
      invalidatesTags: ["Products"],
    }),
    submitBooking: build.mutation({
      query: ({ bookingInformation, account, orders }) => ({
        url: `/booking/new`,
        method: "POST",
        body: { bookingInformation, account, orders },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Bookings", "Products"],
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
      providesTags: ["Bookings"],
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
      invalidatesTags: ["Bookings"],
    }),
    getSingleBooking: build.query({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
      }),
      providesTags: ["Booking"],
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
      invalidatesTags: ["Booking"],
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
      invalidatesTags: ["Booking"],
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
      invalidatesTags: ["Booking"],
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
      invalidatesTags: ["Booking"],
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
      invalidatesTags: ["Booking"],
    }),
    deletePendingBooking: build.mutation({
      query: ({ bookingId }) => ({
        url: `/booking/${bookingId}/delete`,
        method: "DELETE",
      }),
    }),
    getInvoices: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/invoice/all`,
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: ["Invoices"],
    }),
    getSingleInvoice: build.query({
      query: (invoiceId) => ({
        url: `/invoice/${invoiceId}`,
      }),
      providesTags: ["Invoice"],
    }),
    getAccountsReceivables: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/accounts-receivable/all`,
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: ["AccountsReceivables"],
    }),
    getSingleAccountsReceivable: build.query({
      query: (accountsReceivableId) => ({
        url: `/accounts-receivable/${accountsReceivableId}`,
      }),
      providesTags: ["AccountsReceivable"],
    }),
    accountsReceivablePayment: build.mutation({
      query: ({ accountsReceivableId, paymentInfo }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/payment`,
        method: "POST",
        body: { paymentInfo },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["AccountsReceivable"],
    }),
    accountsReceivableVoidPayment: build.mutation({
      query: ({ accountsReceivableId, paymentId }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${paymentId}/void`,
        method: "PATCH",
      }),
      invalidatesTags: ["AccountsReceivable"],
    }),
    accountsReceivableCancelSale: build.mutation({
      query: ({ accountsReceivableId, saleId }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${saleId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["AccountsReceivable"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetCompanyInvitesQuery,
  useCancelCompanyInviteMutation,
  useGetCompanyUsersQuery,
  useCancelUserAccessMutation,
  useInviteCompanyUserMutation,
  useGetAccountsQuery,
  useDeleteAccountsMutation,
  useAddSingleAccountMutation,
  useImportAccountsExcelMutation,
  useGetSingleAccountQuery,
  useGetProductsQuery,
  useDeleteProductsMutation,
  useAddSingleProductMutation,
  useImportProductsExcelMutation,
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
  useGetInvoicesQuery,
  useGetSingleInvoiceQuery,
  useGetAccountsReceivablesQuery,
  useGetSingleAccountsReceivableQuery,
  useAccountsReceivablePaymentMutation,
  useAccountsReceivableVoidPaymentMutation,
  useAccountsReceivableCancelSaleMutation,
} = api;

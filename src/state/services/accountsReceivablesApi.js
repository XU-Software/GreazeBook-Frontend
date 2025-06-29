import { api } from "../api";

export const accountsReceivablesApi = api.injectEndpoints({
  endpoints: (build) => ({
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
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              { type: "AccountsReceivables", id: "LIST" },
              ...result?.data.map((ar) => ({
                type: "AccountsReceivable",
                id: ar.accountsReceivableId,
              })),
            ]
          : [{ type: "AccountsReceivables", id: "LIST" }],
    }),
    getSingleAccountsReceivable: build.query({
      query: (accountsReceivableId) => ({
        url: `/accounts-receivable/${accountsReceivableId}`,
      }),
      providesTags: (result, error, arg) => [
        { type: "AccountsReceivable", id: arg },
      ],
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
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "AccountsReceivables", id: "LIST" },
          { type: "AccountsReceivable", id: arg.accountsReceivableId },
          { type: "Payments", id: "LIST" },
        ];

        // PendingExcesses (We check if pendingExcessIds is not empty, it can be empty because we invalidate all active pendingExcess every transaction and we only create new active pendingExcess if theres overpaid calculated)
        const hasUpdatedItems =
          Array.isArray(result?.affectedPendingExcessIds) &&
          result.affectedPendingExcessIds.length > 0;

        const hasNewCreated = result?.newPendingExcessCreated;

        // Individual updated PendingExcess items
        if (hasUpdatedItems) {
          tags.push(
            ...result.affectedPendingExcessIds.map((pendingExcessId) => ({
              type: "PendingExcess",
              id: pendingExcessId,
            }))
          );
        }

        // Invalidate PendingExcess list if:
        // - Any items updated
        // - OR a new item was created
        if (hasUpdatedItems || hasNewCreated) {
          tags.push({ type: "PendingExcesses", id: "LIST" });
        }

        return tags;
      },
    }),
    accountsReceivableVoidPayment: build.mutation({
      query: ({ accountsReceivableId, paymentId }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${paymentId}/void`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "AccountsReceivables", id: "LIST" },
          { type: "AccountsReceivable", id: arg.accountsReceivableId },
          { type: "Payments", id: "LIST" },
          { type: "Payment", id: arg.paymentId },
        ];

        // PendingExcesses (We check if pendingExcessIds is not empty, it can be empty because we invalidate all active pendingExcess every transaction and we only create new active pendingExcess if theres overpaid calculated)
        const hasUpdatedItems =
          Array.isArray(result?.affectedPendingExcessIds) &&
          result.affectedPendingExcessIds.length > 0;

        const hasNewCreated = result?.newPendingExcessCreated;

        // Individual updated PendingExcess items
        if (hasUpdatedItems) {
          tags.push(
            ...result.affectedPendingExcessIds.map((pendingExcessId) => ({
              type: "PendingExcess",
              id: pendingExcessId,
            }))
          );
        }

        // Invalidate PendingExcess list if:
        // - Any items updated
        // - OR a new item was created
        if (hasUpdatedItems || hasNewCreated) {
          tags.push({ type: "PendingExcesses", id: "LIST" });
        }
      },
    }),
    accountsReceivableCancelSale: build.mutation({
      query: ({ accountsReceivableId, saleId, cancellationDetails }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${saleId}/cancel`,
        method: "PATCH",
        body: { cancellationDetails },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "AccountsReceivables", id: "LIST" },
          { type: "AccountsReceivable", id: arg.accountsReceivableId },
          { type: "Sales", id: "LIST" },
          { type: "Sale", id: arg.saleId },
        ];

        // Products (We check if affectedProductId is not null, it can be null from backend response as it's totalStocks is either replenished or not)
        if (result?.affectedProductId) {
          tags.push({ type: "Product", id: result.affectedProductId });
          tags.push({ type: "Products", id: "LIST" }); // Invalidate products list only if a product was affected
        }

        // PendingExcesses (We check if pendingExcessIds is not empty, it can be empty because we invalidate all active pendingExcess every transaction and we only create new active pendingExcess if theres overpaid calculated)
        const hasUpdatedItems =
          Array.isArray(result?.affectedPendingExcessIds) &&
          result.affectedPendingExcessIds.length > 0;

        const hasNewCreated = result?.newPendingExcessCreated;

        // Individual updated PendingExcess items
        if (hasUpdatedItems) {
          tags.push(
            ...result.affectedPendingExcessIds.map((pendingExcessId) => ({
              type: "PendingExcess",
              id: pendingExcessId,
            }))
          );
        }

        // Invalidate PendingExcess list if:
        // - Any items updated
        // - OR a new item was created
        if (hasUpdatedItems || hasNewCreated) {
          tags.push({ type: "PendingExcesses", id: "LIST" });
        }

        return tags;
      },
    }),
  }),
});

export const {
  useGetAccountsReceivablesQuery,
  useGetSingleAccountsReceivableQuery,
  useAccountsReceivablePaymentMutation,
  useAccountsReceivableVoidPaymentMutation,
  useAccountsReceivableCancelSaleMutation,
} = accountsReceivablesApi;

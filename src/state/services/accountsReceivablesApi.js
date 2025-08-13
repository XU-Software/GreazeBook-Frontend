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

        // Check if payment is made with creditMemo, check for usedCreditMemoId variable
        if (result?.usedCreditMemoId) {
          tags.push(
            { type: "CreditMemos", id: "LIST" },
            { type: "CreditMemo", id: result.usedCreditMemoId }
          );
        }

        // If success we will have affectedAccountId as part of response from the backend
        if (result?.affectedAccountId) {
          tags.push(
            { type: "AccountMetrics", id: result.affectedAccountId },
            { type: "AccountDetails", id: result.affectedAccountId }
          );
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

        // Check if affectedCreditMemoId exist, meaning a payment from a creditMemo was voided
        if (result?.affectedCreditMemoId) {
          tags.push(
            { type: "CreditMemos", id: "LIST" },
            { type: "CreditMemo", id: result.affectedCreditMemoId }
          );
        }

        // If success we will have affectedAccountId as part of response from the backend
        if (result?.affectedAccountId) {
          tags.push(
            { type: "AccountMetrics", id: result.affectedAccountId },
            { type: "AccountDetails", id: result.affectedAccountId }
          );
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

        // If success we will have affectedAccountId as part of response from the backend
        if (result?.affectedAccountId) {
          tags.push(
            { type: "AccountMetrics", id: result.affectedAccountId },
            { type: "AccountDetails", id: result.affectedAccountId }
          );
        }

        // Products (We check if affectedProductId is not null, it can be null from backend response as it's totalStocks is either replenished or not)
        if (result?.affectedProductId) {
          tags.push({ type: "Product", id: result.affectedProductId });
          tags.push({ type: "Products", id: "LIST" });
          tags.push({ type: "ProductsToRestock", id: "LIST" }); // Invalidate products list only if a product was affected
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
    accountsReceivableChangeSale: build.mutation({
      query: ({ accountsReceivableId, saleId, newSale, changeDetails }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${saleId}/change`,
        method: "PATCH",
        body: { newSale, changeDetails },
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
          { type: "Orders", id: "LIST" },
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
          // { type: "Product", id: arg.newSale.productId },
        ];

        // If success we will have affectedAccountId as part of response from the backend
        if (result?.affectedAccountId) {
          tags.push(
            { type: "AccountMetrics", id: result.affectedAccountId },
            { type: "AccountDetails", id: result.affectedAccountId }
          );
        }

        // Invalidate all affected product stocks (from backend response)
        Array.from(new Set(result?.affectedProductIds || [])).forEach(
          (productId) => {
            if (productId) {
              tags.push({ type: "Product", id: productId });
            }
          }
        );

        // Products (We check if affectedProductId is not null, it can be null from backend response as it's totalStocks is either replenished or not)
        // if (result?.affectedProductId) {
        //   tags.push({ type: "Product", id: result.affectedProductId });
        // }

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
    accountsReceivableProcessOverpaymentToRefund: build.mutation({
      query: ({ accountsReceivableId, pendingExcessId, refundDetails }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${pendingExcessId}/refund`,
        method: "PATCH",
        body: { refundDetails },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "AccountsReceivables", id: "LIST" },
        { type: "AccountsReceivable", id: arg.accountsReceivableId },
        { type: "PendingExcesses", id: "LIST" },
        { type: "PendingExcess", id: arg.pendingExcessId },
        { type: "Refunds", id: "LIST" },
        ...(result?.affectedAccountId
          ? [
              { type: "AccountMetrics", id: result.affectedAccountId },
              { type: "AccountDetails", id: result.affectedAccountId },
            ]
          : []),
      ],
    }),
    accountsReceivableProcessOverpaymentToCreditMemo: build.mutation({
      query: ({
        accountsReceivableId,
        pendingExcessId,
        creditMemoDetails,
      }) => ({
        url: `/accounts-receivable/${accountsReceivableId}/${pendingExcessId}/credit-memo`,
        method: "PATCH",
        body: { creditMemoDetails },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "AccountsReceivables", id: "LIST" },
        { type: "AccountsReceivable", id: arg.accountsReceivableId },
        { type: "PendingExcesses", id: "LIST" },
        { type: "PendingExcess", id: arg.pendingExcessId },
        { type: "CreditMemos", id: "LIST" },
        ...(result?.affectedAccountId
          ? [
              { type: "AccountMetrics", id: result.affectedAccountId },
              { type: "AccountDetails", id: result.affectedAccountId },
            ]
          : []),
      ],
    }),
  }),
});

export const {
  useGetAccountsReceivablesQuery,
  useGetSingleAccountsReceivableQuery,
  useAccountsReceivablePaymentMutation,
  useAccountsReceivableVoidPaymentMutation,
  useAccountsReceivableCancelSaleMutation,
  useAccountsReceivableChangeSaleMutation,
  useAccountsReceivableProcessOverpaymentToRefundMutation,
  useAccountsReceivableProcessOverpaymentToCreditMemoMutation,
} = accountsReceivablesApi;

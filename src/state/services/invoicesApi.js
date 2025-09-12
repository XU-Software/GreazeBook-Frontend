import { api } from "../api";

export const invoicesApi = api.injectEndpoints({
  endpoints: (build) => ({
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
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              { type: "Invoices", id: "LIST" },
              ...result?.data.map((invoice) => ({
                type: "Invoice",
                id: invoice.invoiceId,
              })),
            ]
          : [{ type: "Invoices", id: "LIST" }],
    }),
    getSingleInvoice: build.query({
      query: (invoiceId) => ({
        url: `/invoice/${invoiceId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Invoice", id: arg }],
    }),

    cancelInvoice: build.mutation({
      query: (invoiceId) => ({
        url: `/invoice/${invoiceId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "Invoices", id: "LIST" },
          { type: "Invoice", id: arg },
        ];

        if (result?.affectedArId) {
          tags.push(
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: result.affectedArId }
          );
        }

        if (result?.affectedAccountId) {
          tags.push(
            { type: "Accounts", id: "LIST" },
            { type: "Account", id: result.affectedAccountId },
            { type: "AccountMetrics", id: result.affectedAccountId },
            { type: "AccountDetails", id: result.affectedAccountId },
            { type: "CompanySalesVolume", id: "LIST" },
            { type: "CompanySalesVolume", id: result.affectedAccountId }
          );
        }

        if (result?.affectedSaleIds.length) {
          tags.push(
            ...result.affectedSaleIds.map((saleId) => ({
              type: "Sale",
              id: saleId,
            })),
            { type: "Sales", id: "LIST" }
          );
        }

        if (result?.affectedProductIds.length) {
          tags.push(
            ...result.affectedProductIds.map((productId) => ({
              type: "Product",
              id: productId,
            })),
            { type: "Products", id: "LIST" },
            { type: "ProductsToRestock", id: "LIST" }
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

    saveInvoiceTemplate: build.mutation({
      query: (config) => ({
        url: `/invoice/invoice-template`,
        method: "POST",
        body: config,

        headers: {
          "Content-Type": "application/json",
        },
      }),

      invalidatesTags: ["InvoiceTemplate"],
    }),

    getInvoiceTemplate: build.query({
      query: () => ({
        url: `/invoice/invoice-template/fetch`,
      }),
      providesTags: ["InvoiceTemplate"],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetSingleInvoiceQuery,
  useCancelInvoiceMutation,
  useSaveInvoiceTemplateMutation,
  useGetInvoiceTemplateQuery,
} = invoicesApi;

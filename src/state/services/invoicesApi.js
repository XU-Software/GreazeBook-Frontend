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
  }),
});

export const { useGetInvoicesQuery, useGetSingleInvoiceQuery } = invoicesApi;

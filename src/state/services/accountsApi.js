import { api } from "../api";

export const accountsApi = api.injectEndpoints({
  endpoints: (build) => ({
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
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Accounts", id: "LIST" },
              ...result?.data.map((account) => ({
                type: "Account",
                id: account.accountId,
              })),
            ]
          : [{ type: "Accounts", id: "LIST" }],
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
      invalidatesTags: (result, error, arg) => [
        { type: "Accounts", id: "LIST" },
        ...arg.map((accountId) => ({ type: "Account", id: accountId })),
      ],
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
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
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
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
    }),
    getSingleAccount: build.query({
      query: (accountId) => ({
        url: `/account/${accountId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Account", id: arg }],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useDeleteAccountsMutation,
  useAddSingleAccountMutation,
  useImportAccountsExcelMutation,
  useGetSingleAccountQuery,
} = accountsApi;

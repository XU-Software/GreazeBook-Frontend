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
        { type: "CompanySalesVolume", id: "LIST" },
        ...arg.map(
          (accountId) => (
            { type: "Account", id: accountId },
            { type: "CompanySalesVolume", id: accountId }
          )
        ),
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
      invalidatesTags: [
        { type: "Accounts", id: "LIST" },
        { type: "CompanySalesVolume", id: "LIST" },
      ],
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
      invalidatesTags: [
        { type: "Accounts", id: "LIST" },
        { type: "CompanySalesVolume", id: "LIST" },
      ],
    }),
    getAccountInformation: build.query({
      query: (accountId) => ({
        url: `/account/${accountId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Account", id: arg }],
    }),
    getAccountMetrics: build.query({
      query: ({ accountId, startDate, endDate }) => ({
        url: `/account/${accountId}/metrics`,
        params: {
          startDate,
          endDate,
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "AccountMetrics", id: arg.accountId },
      ],
    }),
    getAccountBreakdownLists: build.query({
      query: ({ accountId, startDate, endDate, page, pageSize, search }) => ({
        url: `/account/${accountId}/details`,
        params: { startDate, endDate, page, pageSize, search },
      }),
      providesTags: (result, error, arg) => [
        { type: "AccountDetails", id: arg.accountId },
      ],
    }),
    setOpeningAR: build.mutation({
      query: ({ accountId, openingARInfo }) => ({
        url: `/account/${accountId}/set-opening-ar`,
        method: "POST",
        body: { openingARInfo },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Accounts",
          id: "LIST",
        },
        { type: "Account", id: arg.accountId },
        { type: "AccountMetrics", id: arg.accountId },
        { type: "AccountDetails", id: arg.accountId },
        { type: "AccountsReceivables", id: "LIST" },
      ],
    }),
    updateAccountInfo: build.mutation({
      query: ({ accountId, accountInfoData }) => ({
        url: `/account/${accountId}/update`,
        method: "PATCH",
        body: { accountInfoData },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Accounts", id: "LIST" },
        { type: "Account", id: arg.accountId },
        { type: "CompanySalesVolume", id: "LIST" },
        { type: "CompanySalesVolume", id: arg.accountId },
      ],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useDeleteAccountsMutation,
  useAddSingleAccountMutation,
  useImportAccountsExcelMutation,
  useGetAccountInformationQuery,
  useGetAccountMetricsQuery,
  useGetAccountBreakdownListsQuery,
  useSetOpeningARMutation,
  useUpdateAccountInfoMutation,
} = accountsApi;

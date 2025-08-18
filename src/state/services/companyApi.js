import { api } from "../api";

export const companyApi = api.injectEndpoints({
  endpoints: (build) => ({
    companyDashboard: build.query({
      query: ({ startDate, endDate, normalizedOplan }) => ({
        url: `/company/dashboard`,
        params: {
          startDate,
          endDate,
          oplan: normalizedOplan ? JSON.stringify(normalizedOplan) : undefined, // stringify array
        },
      }),
      providesTags: (result) =>
        result?.affectedCompanyId
          ? [{ type: "CompanyDashboard", id: result.affectedCompanyId }]
          : [],
    }),
    companySalesVolume: build.query({
      query: ({
        year = new Date().getFullYear(),
        page = 1,
        limit = 10,
        search = "",
        sortOrder = "desc",
      }) => ({
        url: `/company/dashboard/monthly-volume`,
        params: {
          year,
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      // Cache invalidation / tagging
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((account) => ({
                type: "CompanySalesVolume",
                id: account.accountId, // 👈 use unique identifier for caching
              })),
              { type: "CompanySalesVolume", id: "LIST" },
            ]
          : [{ type: "CompanySalesVolume", id: "LIST" }],
    }),
  }),
});

export const { useLazyCompanyDashboardQuery, useCompanySalesVolumeQuery } =
  companyApi;

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
  }),
});

export const { useLazyCompanyDashboardQuery } = companyApi;

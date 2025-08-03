import { api } from "../api";

export const companyApi = api.injectEndpoints({
  endpoints: (build) => ({
    companyDashboard: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/company/dashboard`,
        params: {
          startDate,
          endDate,
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

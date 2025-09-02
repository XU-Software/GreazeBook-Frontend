import { api } from "../api";

export const superAdminApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllCompaniesData: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/super-admin/companies`,
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
              { type: "Companies", id: "LIST" },
              ...result?.data.map((company) => ({
                type: "Company",
                id: company.companyId,
              })),
            ]
          : [{ type: "Companies", id: "LIST" }],
    }),
    getSingleCompany: build.query({
      query: (companyId) => ({
        url: `/super-admin/companies/${companyId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Company", id: arg }],
    }),
    changeCompany: build.mutation({
      query: (companyId) => ({
        url: `/super-admin/change-company`,
        method: "POST",
        body: { companyId },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // After successful company change, reset the entire RTK Query cache
          dispatch(api.util.resetApiState());
        } catch {
          // ignore errors (reset only on success)
        }
      },
    }),
    activateSubscription: build.mutation({
      query: ({ companyId, formData }) => ({
        url: `/super-admin/${companyId}/activate-subscription`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Companies", id: "LIST" },
        { type: "Company", id: arg.companyId },
      ],
    }),
    renewSubscription: build.mutation({
      query: ({ companyId, formData }) => ({
        url: `/super-admin/${companyId}/renew-subscription`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Companies", id: "LIST" },
        { type: "Company", id: arg.companyId },
      ],
    }),
  }),
});

export const {
  useGetAllCompaniesDataQuery,
  useGetSingleCompanyQuery,
  useChangeCompanyMutation,
  useActivateSubscriptionMutation,
  useRenewSubscriptionMutation,
} = superAdminApi;

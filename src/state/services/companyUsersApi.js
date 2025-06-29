import { api } from "../api";

export const companyUsersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCompanyUsers: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: "/company/users",
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
              { type: "CompanyUsers", id: "LIST" },
              ...result?.data.map((user) => ({
                type: "CompanyUser",
                id: user.userId,
              })),
            ]
          : [{ type: "CompanyUsers", id: "LIST" }],
    }),
    cancelUserAccess: build.mutation({
      query: (userId) => ({
        url: `/company/users/${userId}/delete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CompanyUsers", id: "LIST" },
        { type: "CompanyUser", id: arg },
      ],
    }),
    inviteCompanyUser: build.mutation({
      query: ({ email, role }) => ({
        url: `/company/invite-user`,
        method: "POST",
        body: { email, role },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "CompanyInvites", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCompanyUsersQuery,
  useCancelUserAccessMutation,
  useInviteCompanyUserMutation,
} = companyUsersApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: ["User", "CompanyInvites", "CompanyUsers", "Accounts"],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => "/company/user-data",
      providesTags: ["User"],
    }),
    getCompanyInvites: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: "/company/invites",
        params: {
          page,
          limit,
          search,
          sortOrder,
        },
      }),
      providesTags: ["CompanyInvites"],
    }),
    cancelCompanyInvite: build.mutation({
      query: (inviteId) => ({
        url: `/company/invitations/${inviteId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["CompanyInvites"],
    }),
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
      providesTags: ["CompanyUsers"],
    }),
    cancelUserAccess: build.mutation({
      query: (userId) => ({
        url: `/company/users/${userId}/delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CompanyUsers"],
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
      invalidatesTags: ["CompanyInvites"],
    }),
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
      providesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetCompanyInvitesQuery,
  useCancelCompanyInviteMutation,
  useGetCompanyUsersQuery,
  useCancelUserAccessMutation,
  useInviteCompanyUserMutation,
  useGetAccountsQuery,
} = api;

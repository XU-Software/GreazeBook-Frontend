import { api } from "../api";

export const companyInvitesApi = api.injectEndpoints({
  endpoints: (build) => ({
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
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              { type: "CompanyInvites", id: "LIST" },
              ...result?.data.map((invite) => ({
                type: "CompanyInvite",
                id: invite.inviteId,
              })),
            ]
          : [{ type: "CompanyInvites", id: "LIST" }],
    }),
    cancelCompanyInvite: build.mutation({
      query: (inviteId) => ({
        url: `/company/invitations/${inviteId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CompanyInvites", id: "LIST" },
        { type: "CompanyInvite", id: arg },
      ],
    }),
  }),
});

export const { useGetCompanyInvitesQuery, useCancelCompanyInviteMutation } =
  companyInvitesApi;

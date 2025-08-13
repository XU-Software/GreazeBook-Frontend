import { api } from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation({
      query: () => ({
        url: `/auth/signout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLogoutMutation } = authApi;

import { api } from "../api";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query({
      query: () => "/company/user-data",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = userApi;

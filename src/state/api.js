import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: ["User", "CompanyInvitations", "CompanyUsers"],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => "/company/user-data",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = api;

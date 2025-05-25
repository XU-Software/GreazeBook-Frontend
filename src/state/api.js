import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DasboardMetrics"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query({
      query: () => "/dashboard",
      providesTags: ["DasboardMetrics"],
    }),
  }),
});

export const { useGetDashboardMetricsQuery } = api;

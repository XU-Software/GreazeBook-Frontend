import { api } from "../api";

const pendingExcessesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPendingExcesses: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/pending-excess/all`,
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
              { type: "PendingExcesses", id: "LIST" },
              ...result?.data.map((pe) => ({
                type: "PendingExcess",
                id: pe.pendingExcessId,
              })),
            ]
          : [{ type: "PendingExcesses", id: "LIST" }],
    }),
  }),
});

export const { useGetPendingExcessesQuery } = pendingExcessesApi;

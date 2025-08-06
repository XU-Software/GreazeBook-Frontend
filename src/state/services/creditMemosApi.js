import { api } from "../api";

const creditMemosApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCreditMemos: build.query({
      query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) => ({
        url: `/credit-memo/all`,
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
              { type: "CreditMemos", id: "LIST" },
              ...result?.data.map((cm) => ({
                type: "CreditMemo",
                id: cm.creditMemoId,
              })),
            ]
          : [{ type: "CreditMemos", id: "LIST" }],
    }),
  }),
});

export const { useGetCreditMemosQuery } = creditMemosApi;

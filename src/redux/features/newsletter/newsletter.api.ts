import baseApi from "@/redux/api/api";
import { GetNewslettersQueryArg, GetNewslettersResponse } from "./newsletter.type";

const newsletterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNewsLetter: builder.query<GetNewslettersResponse, GetNewslettersQueryArg>({
            query: (params) => {
                return {
                    url: "/news/newsletter/",
                    method: "GET",
                    params
                }
            },
            providesTags: ["Newsletter"]
        }),
        deleteNewsletter: builder.mutation<void, string>({
            query: (id) => {
                return {
                    url: `/news/newsletter/${id}/`,
                    method: "DELETE"
  }
            },
            invalidatesTags: ["Newsletter"]
        }),
    })
})

export const {
    useGetNewsLetterQuery,
    useDeleteNewsletterMutation
} = newsletterApi;
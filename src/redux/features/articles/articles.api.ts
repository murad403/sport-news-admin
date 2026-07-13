import baseApi from "@/redux/api/api";

const articlesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getArticles: builder.query({
            query: (params) => {
                return {
                    url: "/news/",
                    method: "GET",
                    params: params
                }
            },
            providesTags: ["Articles"]
        }),
        getArticleDetails: builder.query({
            query: (slug) => {
                return {
                    url: `/news/${slug}/`,
                    method: "GET"
                }
            },
            providesTags: ["Articles"]
        }),
        addArticle: builder.mutation({
            query: (data) => {
                return {
                    url: `/news/manual/`,
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Articles"]
        }),
        updateArticle: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/news/news/${id}/manage/`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: ["Articles"]
        }),
        deleteArticle: builder.mutation({
            query: (id) => {
                return {
                    url: `/news/news/${id}/manage/`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Articles"]
        }),
    })
})

export const {
    useGetArticlesQuery,
    useGetArticleDetailsQuery,
    useAddArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
} = articlesApi;
import baseApi from "@/redux/api/api";
import {
    Article,
    GetArticlesResponse,
    GetArticlesQueryArg,
} from "./articles.type";

const articlesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getArticles: builder.query<GetArticlesResponse, GetArticlesQueryArg>({
            query: (params) => {
                return {
                    url: "/news/",
                    method: "GET",
                    params: params
                }
            },
            providesTags: ["Articles"]
        }),
        getArticleDetails: builder.query<Article, string>({
            query: (slug) => {
                return {
                    url: `/news/${slug}/`,
                    method: "GET"
                }
            },
            providesTags: ["Articles"]
        }),
        addArticle: builder.mutation<Article, FormData>({
            query: (data) => {
                return {
                    url: `/news/manual/`,
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Articles"]
        }),
        updateArticle: builder.mutation<Article, { id: string; data: FormData }>({
            query: ({ id, data }) => {
                return {
                    url: `/news/${id}/manage/`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: ["Articles"]
        }),
        deleteArticle: builder.mutation<void, string>({
            query: (id) => {
                return {
                    url: `/news/${id}/manage/`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Articles"]
        }),



        // requested articles ***************************
        getRequestedArticles: builder.query<GetArticlesResponse, GetArticlesQueryArg>({
            query: (params) => {
                return {
                    url: "/news/pending/",
                    method: "GET",
                    params: params
                }
            },
            providesTags: ["Articles"]
        }),
        approveRequestedArticle: builder.mutation<any, string>({
            query: (id) => {
                return {
                    url: `/news/${id}/approve/`,
                    method: "POST",
                }
            },
            invalidatesTags: ["Articles"]
        }),
        rejectRequestedArticle: builder.mutation<any, { id: string; reason: string }>({
            query: ({ id, reason }) => {
                return {
                    url: `/news/${id}/reject/`,
                    method: "POST",
                    body: { reason }
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
    useGetRequestedArticlesQuery,
    useApproveRequestedArticleMutation,
    useRejectRequestedArticleMutation,
} = articlesApi;
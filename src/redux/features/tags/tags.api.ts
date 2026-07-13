import baseApi from "@/redux/api/api";
import {
  Tag,
  GetTagsResponse,
  GetTagsQueryArg,
  AddTagRequest,
  AddTagResponse,
  UpdateTagRequest,
  UpdateTagResponse,
} from "./tags.type";

const tagsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<GetTagsResponse, GetTagsQueryArg>({
            query: (params) => {
                return {
                    url: "/news/tags/",
                    method: "GET",
                    params: params
                }
            },
            providesTags: ["Tags"]
        }),
        getTag: builder.query<Tag, string>({
            query: (slug) => {
                return {
                    url: `/news/tags/${slug}/`,
                    method: "GET"
                }
            },
            providesTags: ["Tags"]
        }),
        addTag: builder.mutation<AddTagResponse, AddTagRequest>({
            query: (data) => {
                return {
                    url: "/news/tags/",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Tags"]
        }),
        updateTag: builder.mutation<UpdateTagResponse, UpdateTagRequest>({
            query: ({ slug, data }) => {
                return {
                    url: `/news/tags/${slug}/`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: ["Tags"]
        }),
        deleteTag: builder.mutation<void, string>({
            query: (slug) => {
                return {
                    url: `/news/tags/${slug}/`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Tags"]
        }),
    })
})

export const {
    useGetTagsQuery,
    useGetTagQuery,
    useAddTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation
} = tagsApi;
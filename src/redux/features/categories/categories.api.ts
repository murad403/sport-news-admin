import baseApi from "@/redux/api/api";
import {
  Category,
  GetCategoriesResponse,
  GetCategoriesQueryArg,
  AddCategoryRequest,
  AddCategoryResponse,
  UpdateCategoryResponse,
} from "./categories.type";

const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<GetCategoriesResponse, GetCategoriesQueryArg>({
            query: (params) => {
                return {
                    url: "/news/categories/",
                    method: "GET",
                    params: params
                }
            },
            providesTags: ["Categories"]
        }),
        getCategory: builder.query<Category, string>({
            query: (id) => {
                return {
                    url: `/news/categories/${id}/`,
                    method: "GET"
                }
            },
            providesTags: ["Categories"]
        }),
        addCategory: builder.mutation<AddCategoryResponse, AddCategoryRequest>({
            query: (data) => {
                return {
                    url: "/news/categories/",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Categories"]
        }),
        updateCategory: builder.mutation<UpdateCategoryResponse, { id: string; name: string }>({
            query: ({ id, name }) => {
                return {
                    url: `/news/categories/${id}/`,
                    method: "PATCH",
                    body: { name }
                }
            },
            invalidatesTags: ["Categories"]
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => {
                return {
                    url: `/news/categories/${id}/`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Categories"]
        }),
    })
})

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoriesApi;
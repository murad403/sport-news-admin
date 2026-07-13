import baseApi from "@/redux/api/api";


const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => {
                return {
                    url: "/news/categories/",
                    method: "GET"
                }
            },
            providesTags: ["Categories"]
        }),
        getCategory: builder.query({
            query: (slug) => {
                return {
                    url: `/news/categories/${slug}/`,
                    method: "GET"
                }
            },
            providesTags: ["Categories"]
        }),
        addCategory: builder.mutation({
            query: (data) => {
                return {
                    url: "/news/categories/",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Categories"]
        }),
        updateCategory: builder.mutation({
            query: ({slug, data}) => {
                return {
                    url: `/news/categories/${slug}/`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: ["Categories"]
        }),
        deleteCategory: builder.mutation({
            query: (slug) => {
                return {
                    url: `/news/categories/${slug}/`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Categories"]
        }),
    })
})

export const {

} = categoriesApi;
import baseApi from "@/redux/api/api";
import {
  User,
  GetUsersResponse,
  GetUsersQueryArg,
  UpdateUserRequest,
  UpdateUserResponse,
} from "./users.type";

const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<GetUsersResponse, GetUsersQueryArg>({
            query: (params) => {
                return {
                    url: "/auth/users/",
                    method: "GET",
                    params: params
                }
            },
            providesTags: ["Users"]
        }),
        getUserDetails: builder.query<User, string>({
            query: (id) => {
                return {
                    url: `/auth/users/${id}/`,
                    method: "GET"
                }
            },
            providesTags: ["Users"]
        }),
        updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
            query: ({ id, data }) => {
                return {
                    url: `/auth/users/${id}/`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: ["Users"]
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => {
                return {
                    url: `/auth/users/${id}/`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Users"]
        }),
    })
})

export const {
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApi;
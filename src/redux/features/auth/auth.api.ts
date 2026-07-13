import baseApi from "@/redux/api/api";
import {
  SignInRequest,
  SignInResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  User,
} from "./auth.type";


const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (data) => {
                return {
                    url: "/auth/signin/",
                    method: "POST",
                    body: data
                }
            }
        }),
        sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
            query: (data) => {
                return {
                    url: "/auth/send-otp/",
                    method: "POST",
                    body: data
                } 
            }
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (data) => {
                return {
                    url: "/auth/verify-otp/",
                    method: "POST",
                    body: data
                }
            }
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) => {
                return {
                    url: '/auth/reset-password/',
                    method: "POST",
                    body: data
                }
            }
        }),
        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
            query: (data) => {
                return {
                    url: '/auth/change-password/',
                    method: "POST",
                    body: data
                }
            }
        }),

        // profile**************************************
        getProfile: builder.query<User, void>({
            query: () => {
                return {
                    url: '/auth/profile/',
                    method: "GET"
                }
            },
            providesTags: ["Profile"]
        }),
        updateProfile: builder.mutation<User, FormData>({
            query: (data) => {
                return {
                    url: '/auth/profile/',
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: ["Profile"]
        }),
    })
})

export const {
    useSignInMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation
} = authApi;
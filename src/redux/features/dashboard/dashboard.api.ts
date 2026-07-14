import baseApi from "@/redux/api/api";
import {
  GetActivityResponse,
  NewsAnalyticsTrend,
  DashboardSummaryResponse,
} from "./dashboard.type";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActivity: builder.query<GetActivityResponse, { page?: number } | void>({
            query: (params) => {
                return {
                    url: "/core/activity/",
                    method: "GET",
                    params: params || undefined,
                }
            }
        }),
        getNewsAnalyticsTrend: builder.query<NewsAnalyticsTrend[], void>({
            query: () => {
                return {
                    url: "/news/analytics/trend/",
                    method: "GET"
                }
            }
        }),
        getSummary: builder.query<DashboardSummaryResponse, void>({
            query: () => {
                return {
                    url: "/core/dashboard/summary/",
                    method: "GET"
                }
            }
        }),
    })
})

export const {
    useGetActivityQuery,
    useGetNewsAnalyticsTrendQuery,
    useGetSummaryQuery,
} = dashboardApi;
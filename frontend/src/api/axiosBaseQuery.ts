import type { AxiosError, AxiosRequestConfig, Method } from "axios"
import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import { httpClient } from "@/api/httpClient"

type AxiosBaseQueryArgs = {
  url: string
  method?: Method
  data?: AxiosRequestConfig["data"]
  params?: AxiosRequestConfig["params"]
  headers?: AxiosRequestConfig["headers"]
}

type AxiosBaseQueryError = {
  status?: number
  data?: unknown
}

export const axiosBaseQuery = (): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> => {
  return async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await httpClient({
        url,
        method,
        data,
        params,
        headers,
      })

      return { data: result.data }
    } catch (axiosError) {
      const error = axiosError as AxiosError
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data ?? error.message,
        },
      }
    }
  }
}

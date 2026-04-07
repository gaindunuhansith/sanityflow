import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export interface Resource {
  _id: string
  name: string
  category: string
  quantity: number
  unit: string
  reorderLevel: number
  supplier: string
  barcode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const normalizePaginatedResponse = <T>(response: unknown, page = 1, limit = 10): PaginatedResponse<T> => {
  if (Array.isArray(response)) {
    const allItems = response as T[]
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, limit)
    const start = (safePage - 1) * safeLimit
    const items = allItems.slice(start, start + safeLimit)
    const total = allItems.length

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    }
  }

  return response as PaginatedResponse<T>
}

export interface GetResourcesParams {
  category?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateResourcePayload {
  name: string
  category: string
  quantity: number
  unit: string
  reorderLevel: number
  supplier: string
  barcode?: string
  isActive?: boolean
}

export interface UpdateResourcePayload {
  id: string
  name?: string
  category?: string
  quantity?: number
  unit?: string
  reorderLevel?: number
  supplier?: string
  barcode?: string
  isActive?: boolean
}

export interface GetResourceByBarcodeParams {
  barcode: string
}

export const resourceApi = createApi({
  reducerPath: "resourceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Resource"],
  endpoints: (builder) => ({
    getResources: builder.query<PaginatedResponse<Resource>, GetResourcesParams | void>({
      query: (params) => ({
        url: "/resources",
        method: "GET",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<Resource>(response, arg?.page ?? 1, arg?.limit ?? 10),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Resource", id: "LIST" }]
        }

        return [
          { type: "Resource", id: "LIST" },
          ...result.items.map((resource) => ({ type: "Resource" as const, id: resource._id })),
        ]
      },
    }),
    getResourceById: builder.query<Resource, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Resource", id }],
    }),
    getResourceByBarcode: builder.query<Resource, string>({
      query: (barcode) => ({
        url: `/resources`,
        method: "GET",
        params: { barcode },
      }),
      transformResponse: (response: unknown) => {
        if (Array.isArray(response) && response.length > 0) {
          return response[0] as Resource
        }
        return response as Resource
      },
    }),
    createResource: builder.mutation<Resource, CreateResourcePayload>({
      query: (data) => ({
        url: "/resources",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Resource", id: "LIST" }],
    }),
    updateResource: builder.mutation<Resource, UpdateResourcePayload>({
      query: ({ id, ...data }) => ({
        url: `/resources/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Resource", id: "LIST" },
        { type: "Resource", id },
      ],
    }),
    deleteResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Resource", id: "LIST" },
        { type: "Resource", id },
      ],
    }),
  }),
})

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useGetResourceByBarcodeQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi

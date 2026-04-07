import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export interface SupplierContact {
  email?: string
  phone?: string
  address?: string
}

export interface Supplier {
  _id: string
  name: string
  contact: SupplierContact
  productsSupplied: string[]
  reliabilityRating: number
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

export interface GetSuppliersParams {
  search?: string
  page?: number
  limit?: number
}

export interface CreateSupplierPayload {
  name: string
  contact: SupplierContact
  productsSupplied?: string[]
  reliabilityRating?: number
}

export interface UpdateSupplierPayload {
  id: string
  name?: string
  contact?: SupplierContact
  productsSupplied?: string[]
  reliabilityRating?: number
}

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    getSuppliers: builder.query<PaginatedResponse<Supplier>, GetSuppliersParams | void>({
      query: (params) => ({
        url: "/suppliers",
        method: "GET",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<Supplier>(response, arg?.page ?? 1, arg?.limit ?? 10),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Supplier", id: "LIST" }]
        }

        return [
          { type: "Supplier", id: "LIST" },
          ...result.items.map((supplier) => ({ type: "Supplier" as const, id: supplier._id })),
        ]
      },
    }),
    getSupplierById: builder.query<Supplier, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Supplier", id }],
    }),
    createSupplier: builder.mutation<Supplier, CreateSupplierPayload>({
      query: (data) => ({
        url: "/suppliers",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Supplier", id: "LIST" }],
    }),
    updateSupplier: builder.mutation<Supplier, UpdateSupplierPayload>({
      query: ({ id, ...data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Supplier", id: "LIST" },
        { type: "Supplier", id },
      ],
    }),
    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Supplier", id: "LIST" },
        { type: "Supplier", id },
      ],
    }),
  }),
})

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi

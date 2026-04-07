import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type InventoryTransactionType = "ADD" | "REMOVE" | "TRANSFER"

interface InventoryTransactionProduct {
  _id?: string
  name?: string
  category?: string
  unit?: string
}

interface InventoryTransactionUser {
  _id?: string
  name?: string
  email?: string
}

export interface InventoryTransaction {
  _id: string
  product: string | InventoryTransactionProduct
  type: InventoryTransactionType
  quantity: number
  user: string | InventoryTransactionUser
  reason: string
  date: string
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

export interface GetTransactionsParams {
  type?: InventoryTransactionType
  product?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateTransactionPayload {
  product: string
  type: InventoryTransactionType
  quantity: number
  reason: string
  date?: string
}

const INVENTORY_TRANSACTION_PATH = "/inventory-transactions"

export const inventoryTransactionApi = createApi({
  reducerPath: "inventoryTransactionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["InventoryTransaction"],
  endpoints: (builder) => ({
    getTransactions: builder.query<PaginatedResponse<InventoryTransaction>, GetTransactionsParams | void>({
      query: (params) => ({
        url: INVENTORY_TRANSACTION_PATH,
        method: "GET",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<InventoryTransaction>(response, arg?.page ?? 1, arg?.limit ?? 10),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "InventoryTransaction", id: "LIST" }]
        }

        return [
          { type: "InventoryTransaction", id: "LIST" },
          ...result.items.map((transaction) => ({ type: "InventoryTransaction" as const, id: transaction._id })),
        ]
      },
    }),
    getTransactionById: builder.query<InventoryTransaction, string>({
      query: (id) => ({
        url: `${INVENTORY_TRANSACTION_PATH}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "InventoryTransaction", id }],
    }),
    createTransaction: builder.mutation<InventoryTransaction, CreateTransactionPayload>({
      query: (data) => ({
        url: INVENTORY_TRANSACTION_PATH,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "InventoryTransaction", id: "LIST" }],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
} = inventoryTransactionApi

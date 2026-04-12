import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type DistributionOrderStatus = "Pending" | "Assigned" | "In Transit" | "Delivered" | "Failed"
export type DriverAvailability = "Active" | "Inactive"

export interface ApiUserLite {
  _id: string
  name: string
  email: string
}

export interface DriverProfile {
  _id: string
  userId: string
  name: string
  email: string
  contact: string
  vehicleInfo: string
  assignedArea: string
  availability: DriverAvailability
  createdAt: string
  updatedAt: string
}

export interface ResourceItem {
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

export interface BeneficiaryItem {
  _id: string
  name: string
  location: string
  familySize?: number
  contact?: string
  eligibilityStatus: "Pending" | "Active" | "Inactive"
  createdAt?: string
  updatedAt?: string
}

export interface DistributionOrder {
  _id: string
  resource: ResourceItem | string
  quantity: number
  targetLocation: string
  beneficiaries?: Array<BeneficiaryItem | string>
  status: DistributionOrderStatus
  driver?: ApiUserLite | string | null
  notes?: string
  createdBy?: ApiUserLite | string
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

export interface GetDistributionOrdersParams {
  status?: DistributionOrderStatus
  driver?: string
  beneficiary?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateDistributionOrderPayload {
  resource: string
  quantity: number
  targetLocation: string
  beneficiaries?: string[]
  notes?: string
}

export interface UpdateDistributionOrderPayload {
  id: string
  driver?: string
  beneficiaries?: string[]
  notes?: string
}

export interface UpdateDeliveryStatusPayload {
  id: string
  status: Extract<DistributionOrderStatus, "In Transit" | "Delivered" | "Failed">
}

export interface GetDriversParams {
  availability?: DriverAvailability
  page?: number
  limit?: number
}

export interface GetBeneficiariesParams {
  eligibilityStatus?: "Pending" | "Active" | "Inactive"
  page?: number
  limit?: number
}

export const distributionApi = createApi({
  reducerPath: "distributionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DistributionOrder", "Driver", "Resource", "Beneficiary"],
  endpoints: (builder) => ({
    getDistributionOrders: builder.query<PaginatedResponse<DistributionOrder>, GetDistributionOrdersParams | void>({
      query: (params) => ({
        url: "/distributions",
        method: "GET",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<DistributionOrder>(response, arg?.page ?? 1, arg?.limit ?? 10),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "DistributionOrder", id: "LIST" }]
        }

        return [
          { type: "DistributionOrder", id: "LIST" },
          ...result.items.map((order) => ({ type: "DistributionOrder" as const, id: order._id })),
        ]
      },
    }),
    getDistributionOrderById: builder.query<DistributionOrder, string>({
      query: (id) => ({
        url: `/distributions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "DistributionOrder", id }],
    }),
    createDistributionOrder: builder.mutation<DistributionOrder, CreateDistributionOrderPayload>({
      query: (data) => ({
        url: "/distributions",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DistributionOrder", id: "LIST" }],
    }),
    updateDistributionOrder: builder.mutation<DistributionOrder, UpdateDistributionOrderPayload>({
      query: ({ id, ...data }) => ({
        url: `/distributions/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DistributionOrder", id: "LIST" },
        { type: "DistributionOrder", id },
      ],
    }),
    updateDeliveryStatus: builder.mutation<DistributionOrder, UpdateDeliveryStatusPayload>({
      query: ({ id, status }) => ({
        url: `/distributions/${id}/status`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DistributionOrder", id: "LIST" },
        { type: "DistributionOrder", id },
      ],
    }),
    deleteDistributionOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/distributions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "DistributionOrder", id: "LIST" },
        { type: "DistributionOrder", id },
      ],
    }),
    getDrivers: builder.query<DriverProfile[], GetDriversParams | void>({
      query: (params) => ({
        url: "/drivers",
        method: "GET",
        params: {
          ...params,
          page: params?.page ?? 1,
          limit: params?.limit ?? 100,
        },
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<DriverProfile>(response, arg?.page ?? 1, arg?.limit ?? 100).items,
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Driver", id: "LIST" }]
        }

        return [
          { type: "Driver", id: "LIST" },
          ...result.map((driver) => ({ type: "Driver" as const, id: driver._id })),
        ]
      },
    }),
    getResources: builder.query<ResourceItem[], void>({
      query: () => ({
        url: "/resources",
        method: "GET",
      }),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Resource", id: "LIST" }]
        }

        return [
          { type: "Resource", id: "LIST" },
          ...result.map((resource) => ({ type: "Resource" as const, id: resource._id })),
        ]
      },
    }),
    getBeneficiaries: builder.query<BeneficiaryItem[], GetBeneficiariesParams | void>({
      query: (params) => ({
        url: "/beneficiaries",
        method: "GET",
        params: {
          ...params,
          page: params?.page ?? 1,
          limit: params?.limit ?? 100,
        },
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<BeneficiaryItem>(response, arg?.page ?? 1, arg?.limit ?? 100).items,
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Beneficiary", id: "LIST" }]
        }

        return [
          { type: "Beneficiary", id: "LIST" },
          ...result.map((beneficiary) => ({ type: "Beneficiary" as const, id: beneficiary._id })),
        ]
      },
    }),
  }),
})

export const {
  useGetDistributionOrdersQuery,
  useGetDistributionOrderByIdQuery,
  useCreateDistributionOrderMutation,
  useUpdateDistributionOrderMutation,
  useUpdateDeliveryStatusMutation,
  useDeleteDistributionOrderMutation,
  useGetDriversQuery,
  useGetResourcesQuery,
  useGetBeneficiariesQuery,
} = distributionApi

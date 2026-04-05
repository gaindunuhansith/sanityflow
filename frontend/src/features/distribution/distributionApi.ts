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

export interface DistributionOrder {
  _id: string
  resource: string
  quantity: number
  targetLocation: string
  status: DistributionOrderStatus
  driver?: ApiUserLite | string | null
  notes?: string
  createdBy?: ApiUserLite | string
  createdAt: string
  updatedAt: string
}

export interface GetDistributionOrdersParams {
  status?: DistributionOrderStatus
  driver?: string
}

export interface CreateDistributionOrderPayload {
  resource: string
  quantity: number
  targetLocation: string
  notes?: string
}

export interface UpdateDistributionOrderPayload {
  id: string
  driver?: string
  notes?: string
}

export interface UpdateDeliveryStatusPayload {
  id: string
  status: Extract<DistributionOrderStatus, "In Transit" | "Delivered" | "Failed">
}

export interface GetDriversParams {
  availability?: DriverAvailability
}

export const distributionApi = createApi({
  reducerPath: "distributionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DistributionOrder", "Driver", "Resource"],
  endpoints: (builder) => ({
    getDistributionOrders: builder.query<DistributionOrder[], GetDistributionOrdersParams | void>({
      query: (params) => ({
        url: "/distributions",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "DistributionOrder", id: "LIST" }]
        }

        return [
          { type: "DistributionOrder", id: "LIST" },
          ...result.map((order) => ({ type: "DistributionOrder" as const, id: order._id })),
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
        params,
      }),
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
} = distributionApi

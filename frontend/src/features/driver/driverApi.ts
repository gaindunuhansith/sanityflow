import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type DriverAvailability = "Active" | "Inactive"

export interface Driver {
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

export interface GetDriversParams {
  availability?: DriverAvailability
  search?: string
  page?: number
  limit?: number
}

export interface CreateDriverPayload {
  name: string
  email: string
  password: string
  contact: string
  vehicleInfo: string
  assignedArea: string
  availability: DriverAvailability
}

export interface UpdateDriverPayload {
  id: string
  name?: string
  email?: string
  contact?: string
  vehicleInfo?: string
  assignedArea?: string
  availability?: DriverAvailability
}

export interface DeleteDriverResponse {
  message: string
  driver: Driver
}

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Driver"],
  endpoints: (builder) => ({
    getDrivers: builder.query<PaginatedResponse<Driver>, GetDriversParams | void>({
      query: (params) => ({
        url: "/drivers",
        method: "GET",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<Driver>(response, arg?.page ?? 1, arg?.limit ?? 10),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Driver", id: "LIST" }]
        }

        return [
          { type: "Driver", id: "LIST" },
          ...result.items.map((driver) => ({ type: "Driver" as const, id: driver._id })),
        ]
      },
    }),
    getDriverById: builder.query<Driver, string>({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Driver", id }],
    }),
    createDriver: builder.mutation<Driver, CreateDriverPayload>({
      query: (data) => ({
        url: "/drivers",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
    }),
    updateDriver: builder.mutation<Driver, UpdateDriverPayload>({
      query: ({ id, ...data }) => ({
        url: `/drivers/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Driver", id: "LIST" },
        { type: "Driver", id },
      ],
    }),
    deleteDriver: builder.mutation<DeleteDriverResponse, string>({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Driver", id: "LIST" },
        { type: "Driver", id },
      ],
    }),
  }),
})

export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driverApi

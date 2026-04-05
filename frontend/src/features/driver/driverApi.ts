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

export interface GetDriversParams {
  availability?: DriverAvailability
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
    getDrivers: builder.query<Driver[], GetDriversParams | void>({
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

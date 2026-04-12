import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type BeneficiaryEligibilityStatus = "Pending" | "Active" | "Inactive"

export interface BeneficiarySubmittedBy {
  _id: string
  name?: string
  email?: string
}

export interface Beneficiary {
  _id: string
  name: string
  location: string
  familySize: number
  contact: string
  eligibilityStatus: BeneficiaryEligibilityStatus
  submittedBy?: BeneficiarySubmittedBy | string
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

export interface GetBeneficiariesParams {
  eligibilityStatus?: BeneficiaryEligibilityStatus
  search?: string
  page?: number
  limit?: number
}

export interface CreateBeneficiaryPayload {
  name: string
  location: string
  familySize: number
  contact: string
  eligibilityStatus?: BeneficiaryEligibilityStatus
}

export interface UpdateBeneficiaryPayload {
  id: string
  name?: string
  location?: string
  familySize?: number
  contact?: string
  eligibilityStatus?: BeneficiaryEligibilityStatus
}

export interface DeleteBeneficiaryResponse {
  message: string
  beneficiary: Beneficiary
}

export const beneficiaryApi = createApi({
  reducerPath: "beneficiaryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Beneficiary"],
  endpoints: (builder) => ({
    getBeneficiaries: builder.query<PaginatedResponse<Beneficiary>, GetBeneficiariesParams | void>({
      query: (params) => ({
        url: "/beneficiaries",
        method: "GET",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizePaginatedResponse<Beneficiary>(response, arg?.page ?? 1, arg?.limit ?? 10),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Beneficiary", id: "LIST" }]
        }

        return [
          { type: "Beneficiary", id: "LIST" },
          ...result.items.map((beneficiary) => ({ type: "Beneficiary" as const, id: beneficiary._id })),
        ]
      },
    }),
    getBeneficiaryById: builder.query<Beneficiary, string>({
      query: (id) => ({
        url: `/beneficiaries/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Beneficiary", id }],
    }),
    createBeneficiary: builder.mutation<Beneficiary, CreateBeneficiaryPayload>({
      query: (data) => ({
        url: "/beneficiaries",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Beneficiary", id: "LIST" }],
    }),
    updateBeneficiary: builder.mutation<Beneficiary, UpdateBeneficiaryPayload>({
      query: ({ id, ...data }) => ({
        url: `/beneficiaries/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Beneficiary", id: "LIST" },
        { type: "Beneficiary", id },
      ],
    }),
    deleteBeneficiary: builder.mutation<DeleteBeneficiaryResponse, string>({
      query: (id) => ({
        url: `/beneficiaries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Beneficiary", id: "LIST" },
        { type: "Beneficiary", id },
      ],
    }),
  }),
})

export const {
  useGetBeneficiariesQuery,
  useGetBeneficiaryByIdQuery,
  useCreateBeneficiaryMutation,
  useUpdateBeneficiaryMutation,
  useDeleteBeneficiaryMutation,
} = beneficiaryApi

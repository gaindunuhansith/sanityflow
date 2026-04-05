import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type BeneficiaryEligibilityStatus = "Active" | "Inactive"

export interface Beneficiary {
  _id: string
  name: string
  location: string
  familySize: number
  contact: string
  eligibilityStatus: BeneficiaryEligibilityStatus
  createdAt: string
  updatedAt: string
}

export interface GetBeneficiariesParams {
  eligibilityStatus?: BeneficiaryEligibilityStatus
}

export interface CreateBeneficiaryPayload {
  name: string
  location: string
  familySize: number
  contact: string
  eligibilityStatus: BeneficiaryEligibilityStatus
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
    getBeneficiaries: builder.query<Beneficiary[], GetBeneficiariesParams | void>({
      query: (params) => ({
        url: "/beneficiaries",
        method: "GET",
        params,
      }),
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

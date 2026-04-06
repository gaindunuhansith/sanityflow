import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BeneficiaryEligibilityStatus } from "./beneficiaryApi"

export interface BeneficiaryUiState {
  searchText: string
  eligibilityFilter: "all" | BeneficiaryEligibilityStatus
  expandedBeneficiaryIds: string[]
  isCreateDialogOpen: boolean
  selectedBeneficiaryIdForEdit: string | null
  selectedBeneficiaryIdForDelete: string | null
}

const initialState: BeneficiaryUiState = {
  searchText: "",
  eligibilityFilter: "all",
  expandedBeneficiaryIds: [],
  isCreateDialogOpen: false,
  selectedBeneficiaryIdForEdit: null,
  selectedBeneficiaryIdForDelete: null,
}

const beneficiarySlice = createSlice({
  name: "beneficiary",
  initialState,
  reducers: {
    setBeneficiarySearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload
    },
    setEligibilityFilter: (state, action: PayloadAction<"all" | BeneficiaryEligibilityStatus>) => {
      state.eligibilityFilter = action.payload
    },
    clearBeneficiaryFilters: (state) => {
      state.searchText = ""
      state.eligibilityFilter = "all"
    },
    toggleExpandedBeneficiary: (state, action: PayloadAction<string>) => {
      const beneficiaryId = action.payload
      const index = state.expandedBeneficiaryIds.indexOf(beneficiaryId)

      if (index >= 0) {
        state.expandedBeneficiaryIds.splice(index, 1)
      } else {
        state.expandedBeneficiaryIds.push(beneficiaryId)
      }
    },
    collapseBeneficiary: (state, action: PayloadAction<string>) => {
      state.expandedBeneficiaryIds = state.expandedBeneficiaryIds.filter((id) => id !== action.payload)
    },
    setBeneficiaryCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateDialogOpen = action.payload
    },
    setSelectedBeneficiaryIdForEdit: (state, action: PayloadAction<string | null>) => {
      state.selectedBeneficiaryIdForEdit = action.payload
    },
    setSelectedBeneficiaryIdForDelete: (state, action: PayloadAction<string | null>) => {
      state.selectedBeneficiaryIdForDelete = action.payload
    },
  },
})

export const beneficiaryReducer = beneficiarySlice.reducer

export const {
  setBeneficiarySearchText,
  setEligibilityFilter,
  clearBeneficiaryFilters,
  toggleExpandedBeneficiary,
  collapseBeneficiary,
  setBeneficiaryCreateDialogOpen,
  setSelectedBeneficiaryIdForEdit,
  setSelectedBeneficiaryIdForDelete,
} = beneficiarySlice.actions

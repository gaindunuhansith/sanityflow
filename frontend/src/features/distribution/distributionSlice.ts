import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DistributionOrderStatus } from "./distributionApi"

export interface DistributionUiState {
  searchText: string
  statusFilter: "all" | DistributionOrderStatus
  driverFilter: "all" | string
  expandedOrderIds: string[]
  isCreateDialogOpen: boolean
  selectedOrderIdForAssign: string | null
  selectedOrderIdForStatus: string | null
  selectedOrderIdForDelete: string | null
}

const initialState: DistributionUiState = {
  searchText: "",
  statusFilter: "all",
  driverFilter: "all",
  expandedOrderIds: [],
  isCreateDialogOpen: false,
  selectedOrderIdForAssign: null,
  selectedOrderIdForStatus: null,
  selectedOrderIdForDelete: null,
}

const distributionSlice = createSlice({
  name: "distribution",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload
    },
    setStatusFilter: (state, action: PayloadAction<"all" | DistributionOrderStatus>) => {
      state.statusFilter = action.payload
    },
    setDriverFilter: (state, action: PayloadAction<"all" | string>) => {
      state.driverFilter = action.payload
    },
    clearFilters: (state) => {
      state.searchText = ""
      state.statusFilter = "all"
      state.driverFilter = "all"
    },
    toggleExpandedOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload
      const index = state.expandedOrderIds.indexOf(orderId)

      if (index >= 0) {
        state.expandedOrderIds.splice(index, 1)
      } else {
        state.expandedOrderIds.push(orderId)
      }
    },
    collapseOrder: (state, action: PayloadAction<string>) => {
      state.expandedOrderIds = state.expandedOrderIds.filter((id) => id !== action.payload)
    },
    setCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateDialogOpen = action.payload
    },
    setSelectedOrderIdForAssign: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderIdForAssign = action.payload
    },
    setSelectedOrderIdForStatus: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderIdForStatus = action.payload
    },
    setSelectedOrderIdForDelete: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderIdForDelete = action.payload
    },
  },
})

export const distributionReducer = distributionSlice.reducer

export const {
  setSearchText,
  setStatusFilter,
  setDriverFilter,
  clearFilters,
  toggleExpandedOrder,
  collapseOrder,
  setCreateDialogOpen,
  setSelectedOrderIdForAssign,
  setSelectedOrderIdForStatus,
  setSelectedOrderIdForDelete,
} = distributionSlice.actions

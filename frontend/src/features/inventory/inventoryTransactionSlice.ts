import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/store"
import type { InventoryTransactionType } from "./inventoryTransactionApi"

export interface InventoryTransactionUiState {
  searchQuery: string
  typeFilter: "all" | InventoryTransactionType
  page: number
  limit: number
  isCreateModalOpen: boolean
}

const initialState: InventoryTransactionUiState = {
  searchQuery: "",
  typeFilter: "all",
  page: 1,
  limit: 10,
  isCreateModalOpen: false,
}

const inventoryTransactionSlice = createSlice({
  name: "inventoryTransaction",
  initialState,
  reducers: {
    setTransactionSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 1
    },
    setTransactionTypeFilter: (state, action: PayloadAction<"all" | InventoryTransactionType>) => {
      state.typeFilter = action.payload
      state.page = 1
    },
    setTransactionPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setTransactionLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
      state.page = 1
    },
    setCreateTransactionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload
    },
    resetTransactionFilters: (state) => {
      state.searchQuery = ""
      state.typeFilter = "all"
      state.page = 1
      state.limit = 10
    },
  },
})

export const {
  setTransactionSearchQuery,
  setTransactionTypeFilter,
  setTransactionPage,
  setTransactionLimit,
  setCreateTransactionModalOpen,
  resetTransactionFilters,
} = inventoryTransactionSlice.actions

export const inventoryTransactionReducer = inventoryTransactionSlice.reducer

export const selectTransactionState = (state: RootState) => state.inventoryTransaction

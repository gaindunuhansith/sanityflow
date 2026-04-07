import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/store"

export interface SupplierUiState {
  searchQuery: string
  page: number
  limit: number
  isCreateModalOpen: boolean
  editingSuppllierId: string | null
}

const initialState: SupplierUiState = {
  searchQuery: "",
  page: 1,
  limit: 10,
  isCreateModalOpen: false,
  editingSuppllierId: null,
}

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSupplierSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 1
    },
    setSupplierPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setSupplierLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
      state.page = 1
    },
    setCreateSupplierModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload
    },
    setEditingSuppllierId: (state, action: PayloadAction<string | null>) => {
      state.editingSuppllierId = action.payload
    },
    resetSupplierFilters: (state) => {
      state.searchQuery = ""
      state.page = 1
      state.limit = 10
    },
  },
})

export const {
  setSupplierSearchQuery,
  setSupplierPage,
  setSupplierLimit,
  setCreateSupplierModalOpen,
  setEditingSuppllierId,
  resetSupplierFilters,
} = supplierSlice.actions

export const supplierReducer = supplierSlice.reducer

export const selectSupplierState = (state: RootState) => state.supplier

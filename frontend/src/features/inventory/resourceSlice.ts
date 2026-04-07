import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/store"

export interface ResourceUiState {
  searchQuery: string
  categoryFilter: string
  page: number
  limit: number
  isCreateModalOpen: boolean
  editingResourceId: string | null
  barcodeInput: string
  selectedBarcodeResource: string | null
}

const initialState: ResourceUiState = {
  searchQuery: "",
  categoryFilter: "all",
  page: 1,
  limit: 10,
  isCreateModalOpen: false,
  editingResourceId: null,
  barcodeInput: "",
  selectedBarcodeResource: null,
}

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setResourceSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 1
    },
    setResourceCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload
      state.page = 1
    },
    setResourcePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setResourceLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
      state.page = 1
    },
    setCreateResourceModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload
    },
    setEditingResourceId: (state, action: PayloadAction<string | null>) => {
      state.editingResourceId = action.payload
    },
    setBarcodeInput: (state, action: PayloadAction<string>) => {
      state.barcodeInput = action.payload
    },
    setSelectedBarcodeResource: (state, action: PayloadAction<string | null>) => {
      state.selectedBarcodeResource = action.payload
    },
    resetResourceFilters: (state) => {
      state.searchQuery = ""
      state.categoryFilter = "all"
      state.page = 1
      state.limit = 10
    },
    clearBarcodeInput: (state) => {
      state.barcodeInput = ""
      state.selectedBarcodeResource = null
    },
  },
})

export const {
  setResourceSearchQuery,
  setResourceCategoryFilter,
  setResourcePage,
  setResourceLimit,
  setCreateResourceModalOpen,
  setEditingResourceId,
  setBarcodeInput,
  setSelectedBarcodeResource,
  resetResourceFilters,
  clearBarcodeInput,
} = resourceSlice.actions

export const resourceReducer = resourceSlice.reducer

export const selectResourceState = (state: RootState) => state.resource

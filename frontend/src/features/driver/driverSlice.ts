import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DriverAvailability } from "./driverApi"

export interface DriverUiState {
  searchText: string
  availabilityFilter: "all" | DriverAvailability
  expandedDriverIds: string[]
  isCreateDialogOpen: boolean
  selectedDriverIdForEdit: string | null
  selectedDriverIdForDelete: string | null
}

const initialState: DriverUiState = {
  searchText: "",
  availabilityFilter: "all",
  expandedDriverIds: [],
  isCreateDialogOpen: false,
  selectedDriverIdForEdit: null,
  selectedDriverIdForDelete: null,
}

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriverSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload
    },
    setAvailabilityFilter: (state, action: PayloadAction<"all" | DriverAvailability>) => {
      state.availabilityFilter = action.payload
    },
    clearDriverFilters: (state) => {
      state.searchText = ""
      state.availabilityFilter = "all"
    },
    toggleExpandedDriver: (state, action: PayloadAction<string>) => {
      const driverId = action.payload
      const index = state.expandedDriverIds.indexOf(driverId)

      if (index >= 0) {
        state.expandedDriverIds.splice(index, 1)
      } else {
        state.expandedDriverIds.push(driverId)
      }
    },
    collapseDriver: (state, action: PayloadAction<string>) => {
      state.expandedDriverIds = state.expandedDriverIds.filter((id) => id !== action.payload)
    },
    setDriverCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateDialogOpen = action.payload
    },
    setSelectedDriverIdForEdit: (state, action: PayloadAction<string | null>) => {
      state.selectedDriverIdForEdit = action.payload
    },
    setSelectedDriverIdForDelete: (state, action: PayloadAction<string | null>) => {
      state.selectedDriverIdForDelete = action.payload
    },
  },
})

export const driverReducer = driverSlice.reducer

export const {
  setDriverSearchText,
  setAvailabilityFilter,
  clearDriverFilters,
  toggleExpandedDriver,
  collapseDriver,
  setDriverCreateDialogOpen,
  setSelectedDriverIdForEdit,
  setSelectedDriverIdForDelete,
} = driverSlice.actions

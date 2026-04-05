import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/store"
import type { BlogPostStatus } from "@/features/blog/blogApi"

export interface BlogUiState {
  searchQuery: string
  statusFilter: "all" | BlogPostStatus
  page: number
  limit: number
  isCreateModalOpen: boolean
  editingPostId: string | null
}

const initialState: BlogUiState = {
  searchQuery: "",
  statusFilter: "all",
  page: 1,
  limit: 10,
  isCreateModalOpen: false,
  editingPostId: null,
}

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 1
    },
    setBlogStatusFilter: (state, action: PayloadAction<BlogUiState["statusFilter"]>) => {
      state.statusFilter = action.payload
      state.page = 1
    },
    setBlogPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setBlogLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
      state.page = 1
    },
    setCreateBlogModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload
    },
    setEditingBlogPostId: (state, action: PayloadAction<string | null>) => {
      state.editingPostId = action.payload
    },
    resetBlogFilters: (state) => {
      state.searchQuery = ""
      state.statusFilter = "all"
      state.page = 1
      state.limit = 10
    },
  },
})

export const {
  setBlogSearchQuery,
  setBlogStatusFilter,
  setBlogPage,
  setBlogLimit,
  setCreateBlogModalOpen,
  setEditingBlogPostId,
  resetBlogFilters,
} = blogSlice.actions

export const blogReducer = blogSlice.reducer

export const selectBlogState = (state: RootState) => state.blog

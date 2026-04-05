import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/store"

interface ForumState {
  expandedThreadIds: string[]
  searchQuery: string
  categoryFilter: "all" | "alerts" | "projects" | "training"
  tagFilter: string
  statusFilter: "all" | "Open" | "Closed"
  periodFilter: "this-month" | "last-month" | "this-year"
  replyDraftByThreadId: Record<string, string>
}

const initialState: ForumState = {
  expandedThreadIds: [],
  searchQuery: "",
  categoryFilter: "all",
  tagFilter: "all",
  statusFilter: "all",
  periodFilter: "this-month",
  replyDraftByThreadId: {},
}

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    toggleExpandThread: (state, action: PayloadAction<string>) => {
      const threadId = action.payload
      const existingIndex = state.expandedThreadIds.indexOf(threadId)
      if (existingIndex >= 0) {
        state.expandedThreadIds.splice(existingIndex, 1)
        return
      }

      state.expandedThreadIds.push(threadId)
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCategoryFilter: (
      state,
      action: PayloadAction<ForumState["categoryFilter"]>,
    ) => {
      state.categoryFilter = action.payload
    },
    setTagFilter: (state, action: PayloadAction<ForumState["tagFilter"]>) => {
      state.tagFilter = action.payload
    },
    setStatusFilter: (
      state,
      action: PayloadAction<ForumState["statusFilter"]>,
    ) => {
      state.statusFilter = action.payload
    },
    setPeriodFilter: (
      state,
      action: PayloadAction<ForumState["periodFilter"]>,
    ) => {
      state.periodFilter = action.payload
    },
    updateReplyDraft: (
      state,
      action: PayloadAction<{ threadId: string; value: string }>,
    ) => {
      state.replyDraftByThreadId[action.payload.threadId] = action.payload.value
    },
    clearReplyDraft: (state, action: PayloadAction<{ threadId: string }>) => {
      const { threadId } = action.payload
      state.replyDraftByThreadId[threadId] = ""
    },
  },
})

export const {
  toggleExpandThread,
  setSearchQuery,
  setCategoryFilter,
  setTagFilter,
  setStatusFilter,
  setPeriodFilter,
  updateReplyDraft,
  clearReplyDraft,
} = forumSlice.actions

export const forumReducer = forumSlice.reducer

export const selectForumState = (state: RootState) => state.forum

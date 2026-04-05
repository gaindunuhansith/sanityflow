import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/store"

export type ForumTag = "water" | "distributions" | "inventory" | "quality"
export type ForumStatus = "Pending" | "Completed"

export interface ForumReply {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface ForumThread {
  id: string
  title: string
  author: { name: string }
  tag: ForumTag
  createdAt: string
  replyCount: number
  content: string
  status: ForumStatus
  replies: ForumReply[]
}

interface ForumState {
  threads: ForumThread[]
  expandedThreadIds: string[]
  searchQuery: string
  categoryFilter: "all" | "alerts" | "projects" | "training"
  tagFilter: "all" | ForumTag
  periodFilter: "this-month" | "last-month" | "this-year"
  replyDraftByThreadId: Record<string, string>
}

const initialState: ForumState = {
  threads: [],
  expandedThreadIds: [],
  searchQuery: "",
  categoryFilter: "all",
  tagFilter: "all",
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
    submitReply: (state, action: PayloadAction<{ threadId: string }>) => {
      const { threadId } = action.payload
      const draft = state.replyDraftByThreadId[threadId]?.trim()
      if (!draft) {
        return
      }

      const thread = state.threads.find((item) => item.id === threadId)
      if (!thread) {
        return
      }

      thread.replies.push({
        id: `reply-${Date.now()}`,
        author: "Current User",
        content: draft,
        createdAt: new Date().toISOString(),
      })
      thread.replyCount = thread.replies.length
      state.replyDraftByThreadId[threadId] = ""
    },
  },
})

export const {
  toggleExpandThread,
  setSearchQuery,
  setCategoryFilter,
  setTagFilter,
  setPeriodFilter,
  updateReplyDraft,
  submitReply,
} = forumSlice.actions

export const forumReducer = forumSlice.reducer

export const selectForumState = (state: RootState) => state.forum

export const selectVisibleForumThreads = (state: RootState) => {
  const { threads, searchQuery, tagFilter } = state.forum
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return threads.filter((thread) => {
    const matchesTag = tagFilter === "all" || thread.tag === tagFilter

    if (!normalizedQuery) {
      return matchesTag
    }

    const matchesText =
      thread.title.toLowerCase().includes(normalizedQuery) ||
      thread.content.toLowerCase().includes(normalizedQuery) ||
      thread.author.name.toLowerCase().includes(normalizedQuery)

    return matchesTag && matchesText
  })
}

import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type ForumThreadStatus = "Open" | "Closed"

export interface ForumThreadAuthor {
  _id: string
  name: string
}

export interface ForumThread {
  _id: string
  title: string
  content: string
  author: ForumThreadAuthor
  tags: string[]
  status: ForumThreadStatus
  replyCount: number
  createdAt: string
  updatedAt: string
}

export interface ForumReply {
  _id: string
  thread: string
  content: string
  author: ForumThreadAuthor
  createdAt: string
  updatedAt: string
}

export interface GetThreadsResponse {
  threads: ForumThread[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetThreadsParams {
  page?: number
  limit?: number
  status?: ForumThreadStatus
  tag?: string
  search?: string
}

export interface GetRepliesResponse {
  replies: ForumReply[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetRepliesParams {
  threadId: string
  page?: number
  limit?: number
}

export interface CreateReplyPayload {
  threadId: string
  content: string
}

export interface CreateThreadPayload {
  title: string
  content: string
  tags: string[]
  status: ForumThreadStatus
}

export interface UpdateThreadPayload {
  id: string
  data: Partial<CreateThreadPayload>
}

export const forumApi = createApi({
  reducerPath: "forumApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ForumThread", "ForumReply"],
  endpoints: (builder) => ({
    getForumThreads: builder.query<GetThreadsResponse, GetThreadsParams | void>({
      query: (params) => ({
        url: "/community/forum",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "ForumThread", id: "LIST" }]
        }

        return [
          { type: "ForumThread", id: "LIST" },
          ...result.threads.map((thread) => ({
            type: "ForumThread" as const,
            id: thread._id,
          })),
        ]
      },
    }),
    getForumThreadById: builder.query<ForumThread, string>({
      query: (id) => ({
        url: `/community/forum/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ForumThread", id }],
    }),
    getForumReplies: builder.query<GetRepliesResponse, GetRepliesParams>({
      query: ({ threadId, page = 1, limit = 10 }) => ({
        url: `/community/forum/${threadId}/replies`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _error, { threadId }) => [
        { type: "ForumReply", id: `LIST-${threadId}` },
      ],
    }),
    createForumReply: builder.mutation<ForumReply, CreateReplyPayload>({
      query: ({ threadId, content }) => ({
        url: `/community/forum/${threadId}/replies`,
        method: "POST",
        data: { content },
      }),
      invalidatesTags: (_result, _error, { threadId }) => [
        { type: "ForumReply", id: `LIST-${threadId}` },
        { type: "ForumThread", id: "LIST" },
      ],
    }),
    createForumThread: builder.mutation<ForumThread, CreateThreadPayload>({
      query: (data) => ({
        url: "/community/forum",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "ForumThread", id: "LIST" }],
    }),
    updateForumThread: builder.mutation<ForumThread, UpdateThreadPayload>({
      query: ({ id, data }) => ({
        url: `/community/forum/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ForumThread", id },
        { type: "ForumThread", id: "LIST" },
      ],
    }),
    deleteForumThread: builder.mutation<void, string>({
      query: (id) => ({
        url: `/community/forum/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ForumThread", id },
        { type: "ForumThread", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetForumThreadsQuery,
  useGetForumThreadByIdQuery,
  useGetForumRepliesQuery,
  useCreateForumReplyMutation,
  useCreateForumThreadMutation,
  useUpdateForumThreadMutation,
  useDeleteForumThreadMutation,
} = forumApi

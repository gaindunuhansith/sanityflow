import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/api/axiosBaseQuery"

export type BlogPostStatus = "Draft" | "Published"

export interface BlogPost {
  _id: string
  title: string
  summary?: string
  content: string
  coverImage?: string
  tags: string[]
  status: BlogPostStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogListResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetBlogsParams {
  page?: number
  limit?: number
  status?: BlogPostStatus
  tag?: string
  search?: string
}

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogListResponse, GetBlogsParams | void>({
      query: (params) => ({ url: "/blog", method: "GET", params }),
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation<BlogPost, Partial<BlogPost>>({
      query: (data) => ({
        url: "/blog",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation<BlogPost, { id: string; data: Partial<BlogPost> }>({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi
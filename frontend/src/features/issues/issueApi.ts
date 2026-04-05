import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

export interface Issue {
  _id: string;
  issueType: 'Water Quality' | 'Water Shortage' | 'Infrastructure' | 'Other';
  description: string;
  location: string;
  photo?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  reporter: any;
  assignedTo?: any;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  id?: string; // Sometimes APIs return id alongside _id
}

export type CreateIssueData = {
  issueType: 'Water Quality' | 'Water Shortage' | 'Infrastructure' | 'Other';
  description: string;
  location: string;
  photo?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

export type UpdateIssueData = {
  status?: 'Pending' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  resolutionNotes?: string;
}

export const issueApi = createApi({
  reducerPath: 'issueApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token || localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Issue'],
  endpoints: (builder) => ({
    getIssues: builder.query<Issue[], void>({
      query: () => '/issues',
      providesTags: (result) => 
        Array.isArray(result)
          ? [...result.map(({ _id }) => ({ type: 'Issue' as const, id: _id })), 'Issue']
          : ['Issue'],
    }),
    getIssueById: builder.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Issue', id }],
    }),
    createIssue: builder.mutation<Issue, CreateIssueData>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
    updateIssue: builder.mutation<Issue, { id: string; body: UpdateIssueData }>({
      query: ({ id, body }) => ({
        url: `/issues/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Issue', id }, 'Issue'],
    }),
    deleteIssue: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issue'],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi;

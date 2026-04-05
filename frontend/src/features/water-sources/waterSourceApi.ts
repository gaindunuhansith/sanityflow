import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

export interface WaterSource {
  _id: string;
  name: string;
  type: 'well' | 'tap' | 'borehole';
  location: string;
  capacity: number;
  condition: 'Good' | 'Fair' | 'Poor';
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  weather?: any; // The backend getById appends a weather object
}

export type CreateWaterSourceData = {
  name: string;
  type: 'well' | 'tap' | 'borehole';
  location: string;
  capacity: number;
  condition?: 'Good' | 'Fair' | 'Poor';
  isActive?: boolean;
  notes?: string;
}

export type UpdateWaterSourceData = Partial<CreateWaterSourceData>;

export const waterSourceApi = createApi({
  reducerPath: 'waterSourceApi',
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
  tagTypes: ['WaterSource'],
  endpoints: (builder) => ({
    getWaterSources: builder.query<WaterSource[], void>({
      query: () => '/water-sources',
      providesTags: (result) => 
        result
          ? [...result.map(({ _id }) => ({ type: 'WaterSource' as const, id: _id })), 'WaterSource']
          : ['WaterSource'],
    }),
    getWaterSourceById: builder.query<WaterSource, string>({
      query: (id) => `/water-sources/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'WaterSource', id }],
    }),
    createWaterSource: builder.mutation<WaterSource, CreateWaterSourceData>({
      query: (body) => ({
        url: '/water-sources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WaterSource'],
    }),
    updateWaterSource: builder.mutation<WaterSource, { id: string; body: UpdateWaterSourceData }>({
      query: ({ id, body }) => ({
        url: `/water-sources/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'WaterSource', id }, 'WaterSource'],
    }),
    deleteWaterSource: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/water-sources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WaterSource'],
    }),
  }),
});

export const {
  useGetWaterSourcesQuery,
  useGetWaterSourceByIdQuery,
  useCreateWaterSourceMutation,
  useUpdateWaterSourceMutation,
  useDeleteWaterSourceMutation,
} = waterSourceApi;

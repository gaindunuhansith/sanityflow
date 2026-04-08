import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

export interface WaterTest {
  _id: string;
  waterSource:
    | string
    | {
        _id: string;
        name: string;
        location: string;
      };
  testDate: string;
  pH: number;
  tds: number;
  turbidity: number;
  contaminants: string[];
  status: 'Safe' | 'Unsafe';
  tester:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  notes?: string;
  // Weather data for scientific correlation
  temperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  weatherCondition?: string;
  weatherDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateWaterTestData = {
  waterSource: string;
  pH: number;
  tds: number;
  turbidity: number;
  contaminants: string[];
  notes?: string;
};

export type UpdateWaterTestData = Partial<{
  pH: number;
  tds: number;
  turbidity: number;
  contaminants: string[];
  notes?: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  weatherCondition?: string;
  weatherDescription?: string;
}>;

export type WaterTestFilters = {
  source?: string;
  from?: string;
  to?: string;
};

export const waterTestApi = createApi({
  reducerPath: 'waterTestApi',
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
  tagTypes: ['WaterTest'],
  endpoints: (builder) => ({
    getWaterTests: builder.query<WaterTest[], WaterTestFilters | void>({
      query: (params) => ({
        url: '/water-tests',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        Array.isArray(result)
          ? [...result.map(({ _id }) => ({ type: 'WaterTest' as const, id: _id })), 'WaterTest']
          : ['WaterTest'],
    }),
    getWaterTestById: builder.query<WaterTest, string>({
      query: (id) => `/water-tests/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'WaterTest', id }],
    }),
    createWaterTest: builder.mutation<WaterTest, CreateWaterTestData>({
      query: (body) => ({
        url: '/water-tests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WaterTest'],
    }),
    updateWaterTest: builder.mutation<WaterTest, { id: string; body: UpdateWaterTestData }>({
      query: ({ id, body }) => ({
        url: `/water-tests/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'WaterTest', id }, 'WaterTest'],
    }),
    deleteWaterTest: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/water-tests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WaterTest'],
    }),
    getWaterTestAnalytics: builder.query<
      Array<{
        _id: { waterSource: string; year: number; month: number; day: number };
        avgPH: number;
        avgTDS: number;
        avgTurbidity: number;
        avgTemperature?: number;
        avgHumidity?: number;
        avgPressure?: number;
        avgWindSpeed?: number;
        totalTests: number;
        testsWithWeatherData: number;
        unsafeCount: number;
        safeCount: number;
      }>,
      { source?: string } | void
    >({
      query: (params) => ({
        url: '/water-tests/analytics',
        params: params ?? undefined,
      }),
      providesTags: ['WaterTest'],
    }),
  }),
});

export const {
  useGetWaterTestsQuery,
  useGetWaterTestByIdQuery,
  useCreateWaterTestMutation,
  useUpdateWaterTestMutation,
  useDeleteWaterTestMutation,
  useGetWaterTestAnalyticsQuery,
} = waterTestApi;

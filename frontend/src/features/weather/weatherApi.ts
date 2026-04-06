import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

export interface WeatherResponse {
  condition: string;
  temp_c: number;
  humidity: number;
  rainfall_last_1h_mm: number;
  isHighRisk: boolean;
  riskReason?: string;
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
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
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getWeatherByLocation: builder.query<WeatherResponse, string>({
      query: (location) => `/weather/${encodeURIComponent(location)}`,
      providesTags: (_result, _error, location) => [{ type: 'Weather', id: location }],
    }),
  }),
});

export const { useGetWeatherByLocationQuery, useLazyGetWeatherByLocationQuery } = weatherApi;

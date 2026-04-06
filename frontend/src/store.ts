import { configureStore } from '@reduxjs/toolkit'
import { forumReducer } from '@/features/forum/forumSlice'
import { forumApi } from '@/features/forum/forumApi'
import { authReducer } from '@/features/auth/authSlice'
import { authApi } from '@/features/auth/authApi'
import { issueApi } from '@/features/issues/issueApi'
import { distributionReducer } from '@/features/distribution/distributionSlice'
import { distributionApi } from '@/features/distribution/distributionApi'
import { blogApi } from '@/features/blog/blogApi'
import { blogReducer } from '@/features/blog/blogSlice'
import { driverReducer } from '@/features/driver/driverSlice'
import { driverApi } from '@/features/driver/driverApi'
import { waterTestApi } from '@/features/water-tests/waterTestApi'
import { weatherApi } from '@/features/weather/weatherApi'

import { waterSourceApi } from '@/features/water-sources/waterSourceApi'
import { beneficiaryReducer } from '@/features/beneficiary/beneficiarySlice'
import { beneficiaryApi } from '@/features/beneficiary/beneficiaryApi'


export const store = configureStore({
  reducer: {
    forum: forumReducer,
    auth: authReducer,
    distribution: distributionReducer,
    driver: driverReducer,
    beneficiary: beneficiaryReducer,
    blog: blogReducer,
    [authApi.reducerPath]: authApi.reducer,
    [waterTestApi.reducerPath]: waterTestApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [forumApi.reducerPath]: forumApi.reducer,
    [issueApi.reducerPath]: issueApi.reducer,
    [distributionApi.reducerPath]: distributionApi.reducer,
    [driverApi.reducerPath]: driverApi.reducer,
    [beneficiaryApi.reducerPath]: beneficiaryApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [waterSourceApi.reducerPath]: waterSourceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      forumApi.middleware,
      authApi.middleware,
      waterTestApi.middleware,
      weatherApi.middleware,
      distributionApi.middleware,
      driverApi.middleware,
      blogApi.middleware,
      waterSourceApi.middleware,
      beneficiaryApi.middleware,
      issueApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

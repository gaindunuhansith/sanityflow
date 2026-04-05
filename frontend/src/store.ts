import { configureStore } from '@reduxjs/toolkit'
import { forumReducer } from '@/features/forum/forumSlice'
import { forumApi } from '@/features/forum/forumApi'
import { authReducer } from '@/features/auth/authSlice'
import { authApi } from '@/features/auth/authApi'
import { distributionReducer } from '@/features/distribution/distributionSlice'
import { distributionApi } from '@/features/distribution/distributionApi'

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    auth: authReducer,
    distribution: distributionReducer,
    [authApi.reducerPath]: authApi.reducer,
    [forumApi.reducerPath]: forumApi.reducer,
    [distributionApi.reducerPath]: distributionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(forumApi.middleware, authApi.middleware, distributionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

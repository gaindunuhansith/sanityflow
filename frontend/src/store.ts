import { configureStore } from '@reduxjs/toolkit'
import { forumReducer } from '@/features/forum/forumSlice'

export const store = configureStore({
  reducer: {
    forum: forumReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

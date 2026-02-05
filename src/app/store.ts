import tasksReducer from "@/features/tasks/tasksSlice"
import uiReducer from "@/features/ui/uiSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

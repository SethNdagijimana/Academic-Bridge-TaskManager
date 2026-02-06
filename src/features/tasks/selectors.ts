import { RootState } from "@/app/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectTasksState = (state: RootState) => state.tasks
export const selectUiState = (state: RootState) => state.ui

export const selectFilters = createSelector(
  [selectTasksState],
  (tasks) => tasks.filters
)

export const selectIsModalOpen = createSelector(
  [selectTasksState],
  (tasks) => tasks.isModalOpen
)

export const selectEditingTask = createSelector(
  [selectTasksState],
  (tasks) => tasks.editingTask
)

export const selectSidebarOpen = createSelector(
  [selectUiState],
  (ui) => ui.sidebarOpen
)

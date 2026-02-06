import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Task, TaskPriority, TaskStatus } from "./types"

interface TasksState {
  selectedTaskId: string | null
  isModalOpen: boolean
  editingTask: Task | null
  defaultStatus: TaskStatus | null

  filters: {
    priorities: TaskPriority[]
    statuses: TaskStatus[]
    searchQuery: string
  }

  draggedTaskId: string | null
}

const initialState: TasksState = {
  selectedTaskId: null,
  isModalOpen: false,
  editingTask: null,
  defaultStatus: null,
  filters: {
    priorities: [],
    statuses: [],
    searchQuery: ""
  },
  draggedTaskId: null
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ task?: Task; status?: TaskStatus }>
    ) => {
      state.isModalOpen = true
      state.editingTask = action.payload.task || null
      state.defaultStatus = action.payload.status || null
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.editingTask = null
      state.defaultStatus = null
    },

    setPriorityFilter: (state, action: PayloadAction<TaskPriority[]>) => {
      state.filters.priorities = action.payload
    },
    togglePriorityFilter: (state, action: PayloadAction<TaskPriority>) => {
      const index = state.filters.priorities.indexOf(action.payload)
      if (index > -1) {
        state.filters.priorities.splice(index, 1)
      } else {
        state.filters.priorities.push(action.payload)
      }
    },
    setStatusFilter: (state, action: PayloadAction<TaskStatus[]>) => {
      state.filters.statuses = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.filters = {
        priorities: [],
        statuses: [],
        searchQuery: ""
      }
    },

    selectTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload
    },

    setDraggedTask: (state, action: PayloadAction<string | null>) => {
      state.draggedTaskId = action.payload
    },

    toggleStatusFilter: (state, action: PayloadAction<TaskStatus>) => {
      const index = state.filters.statuses.indexOf(action.payload)
      if (index > -1) {
        state.filters.statuses.splice(index, 1)
      } else {
        state.filters.statuses.push(action.payload)
      }
    }
  }
})

export const {
  openModal,
  closeModal,
  setPriorityFilter,
  togglePriorityFilter,
  setStatusFilter,
  setSearchQuery,
  clearFilters,
  selectTask,
  setDraggedTask,
  toggleStatusFilter
} = tasksSlice.actions

export default tasksSlice.reducer

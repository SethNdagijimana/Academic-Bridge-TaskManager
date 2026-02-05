import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Task, TaskPriority, TaskStatus } from "./types"

interface TasksState {
  selectedTaskId: number | null
  isModalOpen: boolean
  editingTask: Task | null
  defaultStatus: TaskStatus | null

  filters: {
    priorities: TaskPriority[]
    statuses: TaskStatus[]
    searchQuery: string
  }
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
  }
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
      state.filters = initialState.filters
    },

    selectTask: (state, action: PayloadAction<number | null>) => {
      state.selectedTaskId = action.payload
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
  selectTask
} = tasksSlice.actions

export default tasksSlice.reducer

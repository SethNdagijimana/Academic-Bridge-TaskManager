import tasksReducer, {
  clearFilters,
  closeModal,
  openModal,
  setSearchQuery,
  togglePriorityFilter,
  toggleStatusFilter
} from "./tasksSlice"
import { Task } from "./types"

describe("tasksSlice", () => {
  const initialState = {
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

  it("should return the initial state", () => {
    expect(tasksReducer(undefined, { type: "unknown" })).toEqual(initialState)
  })

  describe("openModal", () => {
    it("should open modal without task", () => {
      const actual = tasksReducer(initialState, openModal({}))
      expect(actual.isModalOpen).toBe(true)
      expect(actual.editingTask).toBe(null)
      expect(actual.defaultStatus).toBe(null)
    })

    it("should open modal with task", () => {
      const task: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "todo",
        priority: "high"
      }
      const actual = tasksReducer(initialState, openModal({ task }))
      expect(actual.isModalOpen).toBe(true)
      expect(actual.editingTask).toEqual(task)
    })

    it("should open modal with default status", () => {
      const actual = tasksReducer(
        initialState,
        openModal({ status: "in-progress" })
      )
      expect(actual.isModalOpen).toBe(true)
      expect(actual.defaultStatus).toBe("in-progress")
    })
  })

  describe("closeModal", () => {
    it("should close modal and reset state", () => {
      const stateWithOpenModal = {
        ...initialState,
        isModalOpen: true,
        editingTask: {
          id: "1",
          title: "Test",
          status: "todo",
          priority: "high"
        } as Task,
        defaultStatus: "todo" as const
      }
      const actual = tasksReducer(stateWithOpenModal, closeModal())
      expect(actual.isModalOpen).toBe(false)
      expect(actual.editingTask).toBe(null)
      expect(actual.defaultStatus).toBe(null)
    })
  })

  describe("togglePriorityFilter", () => {
    it("should add priority to filters", () => {
      const actual = tasksReducer(initialState, togglePriorityFilter("high"))
      expect(actual.filters.priorities).toContain("high")
    })

    it("should remove priority from filters", () => {
      const stateWithFilter = {
        ...initialState,
        filters: {
          ...initialState.filters,
          priorities: ["high" as const]
        }
      }
      const actual = tasksReducer(stateWithFilter, togglePriorityFilter("high"))
      expect(actual.filters.priorities).not.toContain("high")
    })
  })

  describe("toggleStatusFilter", () => {
    it("should add status to filters", () => {
      const actual = tasksReducer(initialState, toggleStatusFilter("todo"))
      expect(actual.filters.statuses).toContain("todo")
    })

    it("should remove status from filters", () => {
      const stateWithFilter = {
        ...initialState,
        filters: {
          ...initialState.filters,
          statuses: ["todo" as const]
        }
      }
      const actual = tasksReducer(stateWithFilter, toggleStatusFilter("todo"))
      expect(actual.filters.statuses).not.toContain("todo")
    })
  })

  describe("setSearchQuery", () => {
    it("should set search query", () => {
      const actual = tasksReducer(initialState, setSearchQuery("test query"))
      expect(actual.filters.searchQuery).toBe("test query")
    })
  })

  describe("clearFilters", () => {
    it("should clear all filters", () => {
      const stateWithFilters = {
        ...initialState,
        filters: {
          priorities: ["high" as const],
          statuses: ["todo" as const],
          searchQuery: "test"
        }
      }
      const actual = tasksReducer(stateWithFilters, clearFilters())
      expect(actual.filters).toEqual({
        priorities: [],
        statuses: [],
        searchQuery: ""
      })
    })
  })
})

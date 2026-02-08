jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: "en"
    }
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children
}))

jest.mock("@/features/tasks/api")

import tasksReducer from "@/features/tasks/tasksSlice"
import uiReducer from "@/features/ui/uiSlice"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { TaskModal } from "./TaskModal"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
})

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </Provider>
)

describe("TaskModal", () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it("renders create mode when no task is provided", () => {
    render(<TaskModal open={true} onClose={mockOnClose} />, { wrapper })

    expect(
      screen.getByRole("heading", { name: "createTask" })
    ).toBeInTheDocument()
  })

  it("renders edit mode when task is provided", () => {
    const task = {
      id: "1",
      title: "Test Task",
      description: "Test Description",
      status: "todo" as const,
      priority: "high" as const
    }

    render(<TaskModal open={true} onClose={mockOnClose} task={task} />, {
      wrapper
    })

    expect(
      screen.getByRole("heading", { name: "editTask" })
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument()
  })

  it("shows validation error when title is empty", async () => {
    render(<TaskModal open={true} onClose={mockOnClose} />, { wrapper })

    const submitButton = screen.getByRole("button", { name: "createTask" })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("titleRequired")).toBeInTheDocument()
    })
  })

  it("closes modal when cancel button is clicked", () => {
    render(<TaskModal open={true} onClose={mockOnClose} />, { wrapper })

    const cancelButton = screen.getByRole("button", { name: "cancel" })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it("renders all form fields", () => {
    render(<TaskModal open={true} onClose={mockOnClose} />, { wrapper })

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()

    expect(screen.getByText("status")).toBeInTheDocument()
    expect(screen.getByText("priority")).toBeInTheDocument()
    expect(screen.getAllByRole("combobox")).toHaveLength(2)

    const progressElements = screen.getAllByText(/^Progress$/i)
    expect(progressElements[0]).toBeInTheDocument()
  })
})

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

import { Task } from "@/features/tasks/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { screen } from "@testing-library/dom"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TaskCard } from "./TaskCard"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
})

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  status: "todo",
  priority: "high",
  progress: 50,
  tags: ["test", "urgent"],
  assignees: [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
      color: "bg-blue-500"
    }
  ],
  comments: [
    {
      id: 1,
      text: "Test comment",
      author: "John Doe",
      createdAt: "2024-01-01T00:00:00Z"
    }
  ],
  attachments: []
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe("TaskCard", () => {
  it("renders task title and description", () => {
    render(<TaskCard task={mockTask} />, { wrapper })

    expect(screen.getByText("Test Task")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })

  it("displays priority badge", () => {
    render(<TaskCard task={mockTask} />, { wrapper })

    expect(screen.getByText("HIGH")).toBeInTheDocument()
  })

  it("displays tags", () => {
    render(<TaskCard task={mockTask} />, { wrapper })

    expect(screen.getByText("test")).toBeInTheDocument()
    expect(screen.getByText("urgent")).toBeInTheDocument()
  })

  it("displays progress bar when progress is defined", () => {
    render(<TaskCard task={mockTask} />, { wrapper })

    expect(screen.getByText("Progress")).toBeInTheDocument()
    expect(screen.getByText("50%")).toBeInTheDocument()
  })

  it("displays comment count", () => {
    render(<TaskCard task={mockTask} />, { wrapper })

    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup()
    const mockOnEdit = jest.fn()
    const { container } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} />,
      { wrapper }
    )

    const moreButton = container.querySelector(
      '[aria-haspopup="menu"]'
    ) as HTMLElement
    expect(moreButton).toBeInTheDocument()
    await user.click(moreButton)

    const editButton = screen.getByText("Edit")
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it("applies dragging styles when isDragging is true", () => {
    const { container } = render(
      <TaskCard task={mockTask} isDragging={true} />,
      { wrapper }
    )

    const draggingElement = container.firstChild as HTMLElement
    expect(draggingElement).toHaveStyle({ opacity: "0.8" })
  })
})

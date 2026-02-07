/* eslint-disable @typescript-eslint/no-explicit-any */
import { Task, TaskPriority, TaskStatus } from "./types"

const API_URL = "https://dummyjson.com/todos"

function mapDummyTodoToTask(todo: any): Task {
  let status: TaskStatus
  const remainder = todo.id % 3
  if (remainder === 0) {
    status = "todo"
  } else if (remainder === 1) {
    status = "in-progress"
  } else {
    status = "done"
  }

  const priorities: TaskPriority[] = ["low", "medium", "high"]
  const randomPriority = priorities[todo.id % 3]

  return {
    id: String(todo.id),
    title: todo.todo,
    description: `Task from DummyJSON API - User ${todo.userId}`,
    status: status,
    priority: randomPriority,
    progress:
      status === "done"
        ? 100
        : status === "in-progress"
          ? Math.floor(Math.random() * 60) + 20
          : 0,
    tags: ["api", "dummy"],
    assignees: [
      {
        id: todo.userId,
        name: `User ${todo.userId}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${todo.userId}`,
        color: "bg-blue-500"
      }
    ],
    comments: [],
    attachments: [],
    startDate: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    dueDate: new Date(
      Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000
    ).toISOString()
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}?limit=30`)
  if (!res.ok) throw new Error("Failed to fetch tasks")
  const data = await res.json()

  return data.todos.map(mapDummyTodoToTask)
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: task.title,
      completed: task.status === "done",
      userId: 1
    })
  })
  if (!res.ok) throw new Error("Failed to create task")
  const data = await res.json()

  return {
    ...task,
    id: String(data.id)
  }
}

export async function updateTask(task: Task): Promise<Task> {
  const res = await fetch(`${API_URL}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: task.title,
      completed: task.status === "done"
    })
  })
  if (!res.ok) throw new Error("Failed to update task")

  return task
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to delete task")
}

export async function addComment(
  taskId: string,
  text: string,
  author: string
): Promise<Task> {
  const taskRes = await fetch(`${API_URL}/${taskId}`)
  if (!taskRes.ok) throw new Error("Failed to fetch task")
  const todo = await taskRes.json()

  const task = mapDummyTodoToTask(todo)

  const newComment = {
    id: Date.now(),
    text,
    author,
    createdAt: new Date().toISOString()
  }

  return {
    ...task,
    comments: [...(task.comments || []), newComment]
  }
}

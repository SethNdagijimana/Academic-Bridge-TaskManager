import { Task } from "./types"

const API_URL = "http://localhost:4000/tasks"

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch tasks")
  return res.json()
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  })
  if (!res.ok) throw new Error("Failed to create task")
  return res.json()
}

export async function updateTask(task: Task): Promise<Task> {
  const res = await fetch(`${API_URL}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  })
  if (!res.ok) throw new Error("Failed to update task")
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to delete task")
}

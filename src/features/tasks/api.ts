/* eslint-disable @typescript-eslint/no-explicit-any */
import { Task, TaskStatus } from "./types"

const API_URL = "http://localhost:4000/tasks"

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch tasks")
  const data = await res.json()

  const tasks = Array.isArray(data) ? data : data.tasks || []

  return tasks.map((task: any) => {
    let status = task.status as string

    if (status === "2") status = "todo"
    else if (status === "5" || status === "6" || status === "7")
      status = "in-progress"
    else if (status === "8") status = "done"

    return { ...task, status: status as TaskStatus }
  })
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
  const updated = await res.json()

  let status = updated.status as string
  if (status === "2") status = "todo"
  else if (status === "5" || status === "6" || status === "7")
    status = "in-progress"
  else if (status === "8") status = "done"

  return { ...updated, status: status as TaskStatus }
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to delete task")
}

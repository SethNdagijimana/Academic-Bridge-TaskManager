import { Task } from "../types"

export async function fetchTasks(): Promise<Task[]> {
  return []
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  return {
    id: "mock-id",
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate,
    dueDate: task.dueDate,
    assignees: task.assignees,
    comments: task.comments,
    attachments: task.attachments,
    progress: task.progress,
    tags: task.tags
  }
}

export async function updateTask(task: Task): Promise<Task> {
  return task
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteTask(_id: string): Promise<void> {
  return
}

export async function addComment(
  taskId: string,
  text: string,
  author: string
): Promise<Task> {
  return {
    id: taskId,
    title: "Mock Task",
    status: "todo",
    priority: "medium",
    comments: [
      {
        id: Date.now(),
        text,
        author,
        createdAt: new Date().toISOString()
      }
    ]
  }
}

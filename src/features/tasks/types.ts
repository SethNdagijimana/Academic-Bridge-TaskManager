export type TaskStatus = "todo" | "in-progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface TaskComment {
  id: number
  text: string
  author: string
  createdAt: string
}

export interface TaskAttachment {
  id: number
  name: string
  url: string
  type: string
}

export interface TaskAssignee {
  id: number
  name: string
  avatar: string
  color?: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  startDate?: string
  dueDate?: string
  assignees?: TaskAssignee[]
  comments?: TaskComment[]
  attachments?: TaskAttachment[]
  progress?: number // 0-100
  tags?: string[]
}

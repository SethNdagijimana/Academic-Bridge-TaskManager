import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTask, useUpdateTask } from "@/features/tasks/hooks"
import { Task, TaskPriority, TaskStatus } from "@/features/tasks/types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

interface TaskModalProps {
  open: boolean
  onClose: () => void
  task?: Task
  defaultStatus?: TaskStatus
}

interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
}

export function TaskModal({
  open,
  onClose,
  task,
  defaultStatus
}: TaskModalProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      status: defaultStatus || "todo",
      priority: "medium"
    }
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const status = watch("status")
  const priority = watch("priority")

  useEffect(() => {
    if (task) {
      setValue("title", task.title)
      setValue("description", task.description || "")
      setValue("status", task.status)
      setValue("priority", task.priority)
    } else {
      reset({
        title: "",
        description: "",
        status: defaultStatus || "todo",
        priority: "medium"
      })
    }
  }, [task, defaultStatus, setValue, reset])

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        await updateTask.mutateAsync({ ...task, ...data })
      } else {
        await createTask.mutateAsync(data)
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the task details below."
              : "Add a new task to your board."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter task title"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter task description (optional)"
              className="mt-1 min-h-25"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as TaskStatus)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">📋 To Do</SelectItem>
                  <SelectItem value="in-progress">⚡ In Progress</SelectItem>
                  <SelectItem value="done">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setValue("priority", value as TaskPriority)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTask.isPending || updateTask.isPending}
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

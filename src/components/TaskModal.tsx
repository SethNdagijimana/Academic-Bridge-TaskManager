import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTask, useUpdateTask } from "@/features/tasks/hooks"
import { Task, TaskPriority, TaskStatus } from "@/features/tasks/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

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
  startDate?: string
  dueDate?: string
  progress?: number
}

export function TaskModal({
  open,
  onClose,
  task,
  defaultStatus
}: TaskModalProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { t } = useTranslation()

  const [startDate, setStartDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()
  const [progress, setProgress] = useState(0)

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
      priority: "medium",
      progress: 0
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
      setValue("progress", task.progress || 0)
      setProgress(task.progress || 0)
      if (task.startDate) setStartDate(new Date(task.startDate))
      if (task.dueDate) setDueDate(new Date(task.dueDate))
    } else {
      reset({
        title: "",
        description: "",
        status: defaultStatus || "todo",
        priority: "medium",
        progress: 0
      })
      setProgress(0)
      setStartDate(undefined)
      setDueDate(undefined)
    }
  }, [task, defaultStatus, setValue, reset])

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = {
        ...data,
        startDate: startDate?.toISOString(),
        dueDate: dueDate?.toISOString(),
        progress
      }

      if (task) {
        await updateTask.mutateAsync({ ...task, ...taskData })
      } else {
        await createTask.mutateAsync(taskData)
      }
      reset()
      setStartDate(undefined)
      setDueDate(undefined)
      setProgress(0)
      onClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? t("editTask") : t("createTask")}</DialogTitle>
          <DialogDescription>
            {task ? t("updateTask") : t("SubTitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">{t("title")} *</Label>
            <Input
              id="title"
              {...register("title", { required: t("titleRequired") })}
              placeholder={t("enterTitle")}
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={t("enterDescription")}
              className="mt-1 min-h-25"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t("status")}</Label>
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
                  <SelectItem value="todo">{t("todo")}</SelectItem>
                  <SelectItem value="in-progress">{t("inProgress")}</SelectItem>
                  <SelectItem value="done">{t("done")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">{t("priority")}</Label>
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
                  <SelectItem value="low">{t("low")}</SelectItem>
                  <SelectItem value="medium">{t("medium")}</SelectItem>
                  <SelectItem value="high">{t("high")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Progress</Label>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={createTask.isPending || updateTask.isPending}
            >
              {task ? t("updateTask") : t("createTask")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

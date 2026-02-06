import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { TaskDetailsModal } from "@/components/TaskDetailsModal"
import { TaskModal } from "@/components/TaskModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDeleteTask, useTasks } from "@/features/tasks/hooks"
import { closeModal, openModal } from "@/features/tasks/tasksSlice"
import { Task } from "@/features/tasks/types"
import { format, isSameDay } from "date-fns"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, Loader2, Plus } from "lucide-react"
import { useState } from "react"

const priorityColors = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-l-blue-500",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-l-yellow-500",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-l-red-500"
}

export default function CalendarPage() {
  const dispatch = useAppDispatch()
  const { data: tasks = [], isLoading, error } = useTasks()
  const deleteTask = useDeleteTask()
  // const { t } = useTranslation()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const { isModalOpen, editingTask } = useAppSelector((state) => state.tasks)

  const tasksForSelectedDate = tasks.filter((task) => {
    if (!task.dueDate) return false
    return isSameDay(new Date(task.dueDate), selectedDate)
  })

  const datesWithTasks = tasks
    .filter((task) => task.dueDate)
    .map((task) => new Date(task.dueDate!))

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const handleEditTask = (task: Task) => {
    dispatch(openModal({ task }))
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">Failed to load tasks</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="h-full p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar View</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage tasks by date
            </p>
          </div>
          <Button onClick={() => dispatch(openModal({}))}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="lg:col-span-2 p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border-0 w-full flex-1"
            modifiers={{
              hasTask: datesWithTasks
            }}
            modifiersStyles={{
              hasTask: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary))",
                color: "white"
              }
            }}
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(newDate.getDate() - 1)
                  setSelectedDate(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(newDate.getDate() + 1)
                  setSelectedDate(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-60px)]">
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No tasks for this date
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(openModal({}))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 4 }}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${priorityColors[task.priority]}`}
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {task.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="text-xs ml-2 shrink-0"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(task.dueDate), "h:mm a")}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask || undefined}
      />

      <TaskDetailsModal
        task={selectedTask}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(task) => {
          setIsDetailsOpen(false)
          handleEditTask(task)
        }}
        onDelete={(id) => {
          deleteTask.mutate(id)
        }}
      />
    </div>
  )
}

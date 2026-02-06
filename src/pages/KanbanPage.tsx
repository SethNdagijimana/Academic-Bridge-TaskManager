import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { KanbanColumn } from "@/components/KanbanColumn"
import { TaskCard } from "@/components/TaskCard"
import { TaskModal } from "@/components/TaskModal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useTasks, useUpdateTask } from "@/features/tasks/hooks"
import {
  closeModal,
  openModal,
  togglePriorityFilter,
  toggleStatusFilter
} from "@/features/tasks/tasksSlice"
import { Task, TaskStatus } from "@/features/tasks/types"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { motion } from "framer-motion"
import { Filter, Loader2, Plus, SlidersHorizontal, Users } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function KanbanPage() {
  const dispatch = useAppDispatch()
  const { data: tasks = [], isLoading, error } = useTasks()
  const updateTask = useUpdateTask()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const { isModalOpen, editingTask, defaultStatus, filters } = useAppSelector(
    (state) => state.tasks
  )

  const { t } = useTranslation()

  const handleToggleStatusFilter = (status: TaskStatus) => {
    dispatch(toggleStatusFilter(status))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const filteredTasks = tasks.filter((task) => {
    if (
      filters.priorities.length > 0 &&
      !filters.priorities.includes(task.priority)
    ) {
      return false
    }
    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(task.status)
    ) {
      return false
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    done: filteredTasks.filter((t) => t.status === "done")
  }

  const handleAddTask = (status?: TaskStatus) => {
    dispatch(openModal({ status }))
  }

  const handleEditTask = (task: Task) => {
    dispatch(openModal({ task }))
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  const handleTogglePriorityFilter = (priority: "low" | "medium" | "high") => {
    dispatch(togglePriorityFilter(priority))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = String(active.id)
    const task = tasks.find((t) => t.id === taskId)

    if (!task) {
      console.error("Task not found:", taskId)
      return
    }

    let newStatus: TaskStatus | null = null

    if (over.data?.current?.type === "column") {
      newStatus = over.data.current.status as TaskStatus
    } else {
      const overTask = tasks.find((t) => t.id === over.id)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    if (
      !newStatus &&
      ["todo", "in-progress", "done"].includes(String(over.id))
    ) {
      newStatus = String(over.id) as TaskStatus
    }

    if (!newStatus) {
      console.error("Could not determine target status")
      return
    }

    if (task.status !== newStatus) {
      console.log("Updating task", taskId, "from", task.status, "to", newStatus)
      updateTask.mutate({
        ...task,
        status: newStatus
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-red-500 mb-4 text-lg font-medium">
            Failed to load tasks
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Please try again or contact support
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-3xl font-bold mb-1">{t("hrTasksHub")}</p>
            <p className="text-sm text-muted-foreground">
              {t("trackWorkflow")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {t("filter")}
                  {(filters.priorities.length > 0 ||
                    filters.statuses.length > 0) && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                      {filters.priorities.length + filters.statuses.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t("priority")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.priorities.includes("high")}
                  onCheckedChange={() => handleTogglePriorityFilter("high")}
                >
                  {t("high")} {t("priority")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.priorities.includes("medium")}
                  onCheckedChange={() => handleTogglePriorityFilter("medium")}
                >
                  {t("medium")} {t("priority")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.priorities.includes("low")}
                  onCheckedChange={() => handleTogglePriorityFilter("low")}
                >
                  {t("low")} {t("priority")}
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.statuses.includes("todo")}
                  onCheckedChange={() => handleToggleStatusFilter("todo")}
                >
                  📋 To Do
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.statuses.includes("in-progress")}
                  onCheckedChange={() =>
                    handleToggleStatusFilter("in-progress")
                  }
                >
                  ⚡ In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.statuses.includes("done")}
                  onCheckedChange={() => handleToggleStatusFilter("done")}
                >
                  ✅ Done
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t("view")}
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              {t("team")}
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleAddTask()}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("addTask")}
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: t("totalTasks"),
              value: tasks.length,
              color: "from-blue-500 to-cyan-500"
            },
            {
              label: t("todo"),
              value: tasksByStatus.todo.length,
              color: "from-slate-500 to-slate-600"
            },
            {
              label: t("inProgress"),
              value: tasksByStatus["in-progress"].length,
              color: "from-yellow-500 to-orange-500"
            },
            {
              label: t("completed"),
              value: tasksByStatus.done.length,
              color: "from-green-500 to-emerald-500"
            }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 rounded-lg p-4 border relative overflow-hidden group cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              />
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <KanbanColumn
              key="todo"
              status="todo"
              title="To Do"
              tasks={tasksByStatus.todo}
              count={tasksByStatus.todo.length}
              onAddTask={() => handleAddTask("todo")}
              onEditTask={handleEditTask}
            />
            <KanbanColumn
              key="in-progress"
              status="in-progress"
              title="In Progress"
              tasks={tasksByStatus["in-progress"]}
              count={tasksByStatus["in-progress"].length}
              onAddTask={() => handleAddTask("in-progress")}
              onEditTask={handleEditTask}
            />
            <KanbanColumn
              key="done"
              status="done"
              title="Done"
              tasks={tasksByStatus.done}
              count={tasksByStatus.done.length}
              onAddTask={() => handleAddTask("done")}
              onEditTask={handleEditTask}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 cursor-grabbing">
                <TaskCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask || undefined}
        defaultStatus={defaultStatus || undefined}
      />
    </div>
  )
}

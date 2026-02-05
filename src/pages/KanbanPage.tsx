import { KanbanColumn } from "@/components/KanbanColumn"
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
import { useTasks } from "@/features/tasks/hooks"
import { Task, TaskStatus } from "@/features/tasks/types"
import { AnimatePresence, motion } from "framer-motion"
import { Filter, Loader2, Plus, SlidersHorizontal, Users } from "lucide-react"
import { useState } from "react"

export default function KanbanPage() {
  const { data: tasks = [], isLoading, error } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>()
  const [filters, setFilters] = useState({
    priorities: [] as string[],
    assignees: [] as string[]
  })

  const filteredTasks = tasks.filter((task) => {
    if (
      filters.priorities.length > 0 &&
      !filters.priorities.includes(task.priority)
    ) {
      return false
    }
    return true
  })

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    done: filteredTasks.filter((t) => t.status === "done")
  }

  const handleAddTask = (status?: TaskStatus) => {
    setDefaultStatus(status)
    setEditingTask(undefined)
    setModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDefaultStatus(undefined)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTask(undefined)
    setDefaultStatus(undefined)
  }

  const togglePriorityFilter = (priority: string) => {
    setFilters((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter((p) => p !== priority)
        : [...prev.priorities, priority]
    }))
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
            <p className="text-3xl font-bold mb-1">HR Tasks Hub </p>
            <p className="text-sm text-muted-foreground">
              Track and manage your team's workflow
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  {filters.priorities.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                      {filters.priorities.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.priorities.includes("high")}
                  onCheckedChange={() => togglePriorityFilter("high")}
                >
                  🔴 High Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.priorities.includes("medium")}
                  onCheckedChange={() => togglePriorityFilter("medium")}
                >
                  🟡 Medium Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.priorities.includes("low")}
                  onCheckedChange={() => togglePriorityFilter("low")}
                >
                  🟢 Low Priority
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              View
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleAddTask()}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Tasks",
              value: tasks.length,
              color: "from-blue-500 to-cyan-500"
            },
            {
              label: "To Do",
              value: tasksByStatus.todo.length,
              color: "from-slate-500 to-slate-600"
            },
            {
              label: "In Progress",
              value: tasksByStatus["in-progress"].length,
              color: "from-yellow-500 to-orange-500"
            },
            {
              label: "Completed",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}

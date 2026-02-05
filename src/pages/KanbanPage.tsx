import { KanbanColumn } from "@/components/KanbanColumn"
import { TaskModal } from "@/components/TaskModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTasks } from "@/features/tasks/hooks"
import { Task, TaskStatus } from "@/features/tasks/types"
import { motion } from "framer-motion"
import { Loader2, Plus, Search } from "lucide-react"
import { useState } from "react"

export default function KanbanPage() {
  const { data: tasks = [], isLoading, error } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-red-500 mb-4">Failed to load tasks</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Kanban Board
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your tasks efficiently
            </p>
          </div>
          <Button onClick={() => handleAddTask()} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <KanbanColumn
          status="todo"
          title="To Do"
          tasks={tasksByStatus.todo}
          count={tasksByStatus.todo.length}
          onAddTask={() => handleAddTask("todo")}
          onEditTask={handleEditTask}
        />
        <KanbanColumn
          status="in-progress"
          title="In Progress"
          tasks={tasksByStatus["in-progress"]}
          count={tasksByStatus["in-progress"].length}
          onAddTask={() => handleAddTask("in-progress")}
          onEditTask={handleEditTask}
        />
        <KanbanColumn
          status="done"
          title="Done"
          tasks={tasksByStatus.done}
          count={tasksByStatus.done.length}
          onAddTask={() => handleAddTask("done")}
          onEditTask={handleEditTask}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}

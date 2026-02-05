import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { TaskModal } from "@/components/TaskModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useDeleteTask, useTasks } from "@/features/tasks/hooks"
import {
  closeModal,
  openModal,
  setSearchQuery
} from "@/features/tasks/tasksSlice"
import { Task } from "@/features/tasks/types"
import { motion } from "framer-motion"
import { Edit, Loader2, MoreVertical, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

export default function TablePage() {
  const dispatch = useAppDispatch()
  const { data: tasks = [], isLoading, error } = useTasks()
  const deleteTask = useDeleteTask()

  const { isModalOpen, editingTask, filters } = useAppSelector(
    (state) => state.tasks
  )

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      task.description
        ?.toLowerCase()
        .includes(filters.searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleEdit = (task: Task) => {
    dispatch(openModal({ task }))
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(id)
    }
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  }

  const statusColors = {
    todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    "in-progress":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    done: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Task List
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View all tasks in table format
            </p>
          </div>
          <Button onClick={() => dispatch(openModal({}))} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-45">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-45">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-lg border overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12.5">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">No tasks found</p>
                  <Button
                    variant="link"
                    onClick={() => dispatch(openModal({}))}
                    className="mt-2"
                  >
                    Create your first task
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task, index) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {task.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[task.status]}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask || undefined}
      />
    </div>
  )
}

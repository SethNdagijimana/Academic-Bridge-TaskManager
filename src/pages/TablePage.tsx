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
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table"
import { motion } from "framer-motion"
import {
  ArrowUpDown,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2
} from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function TablePage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { data: tasks = [], isLoading, error } = useTasks()
  const deleteTask = useDeleteTask()

  const { isModalOpen, editingTask, filters } = useAppSelector(
    (state) => state.tasks
  )

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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

  const handleEdit = (task: Task) => {
    dispatch(openModal({ task }))
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteTask.mutate(id)
    }
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  // Define columns using TanStack Table
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
        enableSorting: false,
        size: 50
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              {t("title")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("title")}</div>
        )
      },
      {
        accessorKey: "description",
        header: t("description"),
        cell: ({ row }) => (
          <div className="text-muted-foreground line-clamp-2">
            {row.getValue("description") || "-"}
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              {t("status")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const status = row.getValue("status") as keyof typeof statusColors
          return (
            <Badge className={statusColors[status]}>
              {status.replace("-", " ")}
            </Badge>
          )
        }
      },
      {
        accessorKey: "priority",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-0 hover:bg-transparent"
            >
              {t("priority")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const priority = row.getValue(
            "priority"
          ) as keyof typeof priorityColors
          return <Badge className={priorityColors[priority]}>{priority}</Badge>
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const task = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("editTask")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("deleteTask")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        enableSorting: false,
        size: 80
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  )

  // Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        task.description
          ?.toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, filters.searchQuery, statusFilter, priorityFilter])

  // Initialize TanStack Table
  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters
    }
  })

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
        <p className="text-red-500 mb-4">{t("failedToLoad")}</p>
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-sky-800 bg-clip-text text-transparent">
              {t("table")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("taskListView")}
            </p>
          </div>
          <Button onClick={() => dispatch(openModal({}))} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            {t("newTask")}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
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
              <SelectItem value="todo">{t("todo")}</SelectItem>
              <SelectItem value="in-progress">{t("inProgress")}</SelectItem>
              <SelectItem value="done">{t("done")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-45">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">{t("low")}</SelectItem>
              <SelectItem value="medium">{t("medium")}</SelectItem>
              <SelectItem value="high">{t("high")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-lg border overflow-hidden"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">{t("noTasks")}</p>
                  <Button
                    variant="link"
                    onClick={() => dispatch(openModal({}))}
                    className="mt-2"
                  >
                    {t("createFirstTask")}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask || undefined}
      />
    </div>
  )
}

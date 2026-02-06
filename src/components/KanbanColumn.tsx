import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Task, TaskStatus } from "@/features/tasks/types"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { TaskCard } from "./TaskCard"

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  count: number
}

const statusColors = {
  todo: "bg-slate-100 dark:bg-slate-800",
  "in-progress": "bg-blue-100 dark:bg-blue-900/20",
  done: "bg-green-100 dark:bg-green-900/20"
}

const statusEmojis = {
  todo: "📋",
  "in-progress": "⚡",
  done: "✅"
}

function SortableTaskCard({
  task,
  onEdit
}: {
  task: Task
  onEdit: (task: Task) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} isDragging={isDragging} />
    </div>
  )
}

export function KanbanColumn({
  status,
  title,
  tasks,
  onAddTask,
  onEditTask,
  count
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status: status
    }
  })

  const taskIds = tasks.map((task) => task.id)

  return (
    <div className="flex flex-col h-full">
      <div className={`${statusColors[status]} rounded-lg p-3 mb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusEmojis[status]}</span>
            <p className="font-semibold text-sm">{title}</p>
            <span className="text-xs bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {count}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-3 overflow-y-auto pr-1 transition-colors rounded-lg p-2 ${
            isOver
              ? "bg-sky-50 dark:bg-sky-900/10 border-2 border-dashed border-sky-300 dark:border-sky-700"
              : ""
          }`}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}

          {tasks.length === 0 && !isOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Card className="p-6 border-dashed">
                <p className="text-sm text-muted-foreground">No tasks yet</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={onAddTask}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add task
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

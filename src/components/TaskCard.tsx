import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useDeleteTask } from "@/features/tasks/hooks"
import { Task } from "@/features/tasks/types"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import {
  Clock,
  Edit,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Trash2
} from "lucide-react"

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  isDragging?: boolean
}

const priorityColors = {
  low: "bg-white text-primary dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  medium:
    "bg-gray-100 text-primary dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  high: "bg-emerald-100/50 text-primary dark:bg-emerald-900/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
}

const priorityGradients = {
  low: "from-primary to-sky-900",
  medium: "from-gray-500 to-gray-900",
  high: "from-green-500 to-emerald-900"
}

export function TaskCard({ task, onEdit, isDragging }: TaskCardProps) {
  const deleteTask = useDeleteTask()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id)
    }
  }

  const commentCount = task.comments?.length || 0
  const attachmentCount = task.attachments?.length || 0
  const assignees = task.assignees || []

  const formatDateRange = () => {
    if (!task.startDate && !task.dueDate) return null
    if (task.dueDate) {
      try {
        return formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })
      } catch {
        return task.dueDate
      }
    }
    return null
  }

  return (
    <div
      style={{
        opacity: isDragging ? 0.8 : 1,
        transform: isDragging ? "rotate(2deg)" : "rotate(0deg)"
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card
        className={`p-4 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border-l-4 ${priorityColors[task.priority]}`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${priorityGradients[task.priority]} opacity-60`}
        />

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={`text-xs font-medium ${priorityColors[task.priority]}`}
              >
                {task.priority.toUpperCase()}
              </Badge>
              {task.tags?.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="font-semibold text-sm mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bar */}
        {task.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-1.5" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-3">
            {/* Date */}
            {formatDateRange() && (
              <motion.div
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDateRange()}</span>
              </motion.div>
            )}

            {/* Comments */}
            {commentCount > 0 && (
              <motion.div
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{commentCount}</span>
              </motion.div>
            )}

            {/* Attachments */}
            {attachmentCount > 0 && (
              <motion.div
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span>{attachmentCount}</span>
              </motion.div>
            )}
          </div>

          {/* Assignees */}
          {assignees.length > 0 && (
            <div className="flex -space-x-2">
              {assignees.slice(0, 3).map((assignee, i) => (
                <motion.div
                  key={assignee.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                >
                  <Avatar className="h-7 w-7 border-2 border-background ring-2 ring-background">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback
                      className={`text-xs ${assignee.color || "bg-primary"}`}
                    >
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
              {assignees.length > 3 && (
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    +{assignees.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

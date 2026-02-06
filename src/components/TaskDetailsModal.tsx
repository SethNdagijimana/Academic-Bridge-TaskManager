import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAddComment } from "@/features/tasks/hooks"

import { Task } from "@/features/tasks/types"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Edit,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
  Users
} from "lucide-react"
import { useState } from "react"

interface TaskDetailsModalProps {
  task: Task | null
  open: boolean
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
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

export function TaskDetailsModal({
  task,
  open,
  onClose,
  onEdit,
  onDelete
}: TaskDetailsModalProps) {
  const [newComment, setNewComment] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const addComment = useAddComment()

  if (!task) return null

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment.mutate(
        {
          taskId: task.id,
          text: newComment,
          author: "Seth N."
        },
        {
          onSuccess: () => {
            setNewComment("")
          }
        }
      )
    }
  }

  const handleDelete = () => {
    onDelete(task.id)
    setDeleteDialogOpen(false)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[95vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={statusColors[task.status]}>
                    {task.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge className={priorityColors[task.priority]}>
                    {task.priority.toUpperCase()}
                  </Badge>
                  {task.tags?.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <DialogTitle className="text-2xl">{task.title}</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="px-6 py-4 space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-semibold">Description</Label>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Progress */}
              {task.progress !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">Progress</Label>
                    <span className="text-sm font-medium">
                      {task.progress}%
                    </span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                {task.startDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-semibold">
                        Start Date
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-semibold">Due Date</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(task.dueDate), {
                        addSuffix: true
                      })}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Assignees */}
              {task.assignees && task.assignees.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-semibold">Assignees</Label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {task.assignees.map((assignee) => (
                      <motion.div
                        key={assignee.id}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback className={assignee.color}>
                            {assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {assignee.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-semibold">Attachments</Label>
                  </div>
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <motion.div
                        key={attachment.id}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attachment.type.toUpperCase()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Comments */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-semibold">
                    Comments ({task.comments?.length || 0})
                  </Label>
                </div>

                <div className="space-y-4 mb-4">
                  {task.comments?.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">
                            {comment.author}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {comment.text}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-3">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                    disabled={addComment.isPending}
                  />
                  <Button
                    size="icon"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addComment.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </>
  )
}

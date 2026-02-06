import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useTasks } from "@/features/tasks/hooks"
import { TaskAssignee } from "@/features/tasks/types"
import { motion } from "framer-motion"
import { Mail, Phone, Plus, Search } from "lucide-react"
import { useState } from "react"

export default function TeamPage() {
  const { data: tasks = [] } = useTasks()
  const [searchQuery, setSearchQuery] = useState("")

  const assigneeMap = new Map<
    number,
    TaskAssignee & { tasksCount: number; completedTasks: number }
  >()

  tasks.forEach((task) => {
    task.assignees?.forEach((assignee) => {
      if (!assigneeMap.has(assignee.id)) {
        assigneeMap.set(assignee.id, {
          ...assignee,
          tasksCount: 0,
          completedTasks: 0
        })
      }
      const member = assigneeMap.get(assignee.id)!
      member.tasksCount++
      if (task.status === "done") {
        member.completedTasks++
      }
    })
  })

  const allMembers = Array.from(assigneeMap.values())

  const filteredMembers = allMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view team member workload
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, index) => {
          const completionRate =
            member.tasksCount > 0
              ? Math.round((member.completedTasks / member.tasksCount) * 100)
              : 0

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className={member.color || "bg-primary"}>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Team Member
                  </p>

                  <div className="w-full space-y-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tasks</span>
                      <Badge variant="secondary">{member.tasksCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completed</span>
                      <Badge variant="secondary">{member.completedTasks}</Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Completion Rate
                        </span>
                        <span className="font-medium">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No team members found</p>
        </div>
      )}
    </div>
  )
}

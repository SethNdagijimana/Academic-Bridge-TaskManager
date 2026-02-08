import { Card } from "@/components/ui/card"
import { useTasks } from "@/features/tasks/hooks"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { data: tasks = [] } = useTasks()

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length
  }

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      label: "To Do",
      value: stats.todo,
      icon: Circle,
      color: "text-slate-600"
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      label: "Completed",
      value: stats.done,
      icon: CheckCircle2,
      color: "text-green-600"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

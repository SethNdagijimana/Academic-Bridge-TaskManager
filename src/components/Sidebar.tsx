import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  FolderKanban,
  Home,
  LayoutGrid,
  List,
  Sparkles,
  Users
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Board", icon: LayoutGrid, path: "/" },
  { name: "List", icon: List, path: "/list" },
  { name: "Calendar", icon: Calendar, path: "/calendar" },
  { name: "Team", icon: Users, path: "/team" }
]

const recentPages = [
  { name: "World Comp", icon: Building2, color: "bg-blue-500" },
  { name: "Arcelor Group", icon: Building2, color: "bg-purple-500" },
  { name: "IB Talks Hub", icon: FileText, color: "bg-green-500" },
  { name: "Endevis Tamodek", icon: FolderKanban, color: "bg-orange-500" }
]

const recentProjects = [
  { name: "HR Tasks Hub", color: "bg-pink-500" },
  { name: "WHMCS Panel", color: "bg-cyan-500" },
  { name: "Marketing Campaign", color: "bg-amber-500" }
]

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 bg-white dark:bg-slate-950 border-r",
          "flex flex-col shadow-xl transition-transform duration-300",

          isOpen ? "translate-x-0" : "-translate-x-full",

          "lg:translate-x-0 lg:static lg:shadow-none"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="h-8 w-8 bg-linear-to-br from-primary to-sky-600 rounded-lg flex items-center justify-center"
            >
              <LayoutGrid className="h-4 w-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg bg-linear-to-r from-primary to-sky-600 bg-clip-text text-transparent">
              Task Manager
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1 mb-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        isActive &&
                          "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <Separator className="my-4" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("recentPages")}
              </p>
            </div>
            <div className="space-y-1">
              {recentPages.map((page, i) => (
                <motion.div
                  key={page.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-9 text-sm group"
                  >
                    <div className={cn("h-2 w-2 rounded-full", page.color)} />
                    <span className="truncate">{page.name}</span>
                    <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 px-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("recentProjects")}
              </p>
            </div>
            <div className="space-y-1">
              {recentProjects.map((project, i) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-9 text-sm"
                  >
                    <div
                      className={cn("h-2 w-2 rounded-full", project.color)}
                    />
                    <span className="truncate">{project.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t">
          <Card className="p-4 bg-linear-to-br from-primary via-sky-800 to-gray-500 text-white border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">Seth N.</p>
                  <p className="text-xs text-white/80 truncate">
                    seth@example.com
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Maximize your potential
              </p>
              <Button
                size="sm"
                className="w-full bg-white text-sky-600 hover:bg-white/90 h-8"
              >
                Upgrade Now
              </Button>
            </div>
          </Card>
        </div>
      </aside>
    </>
  )
}

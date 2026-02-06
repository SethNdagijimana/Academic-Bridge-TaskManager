import { ReactNode, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { setSearchQuery } from "@/features/tasks/tasksSlice"
import {
  setLanguage,
  setSidebarOpen,
  toggleSidebar,
  toggleTheme
} from "@/features/ui/uiSlice"
import { motion } from "framer-motion"
import { Bell, Languages, Menu, Moon, Search, Sun } from "lucide-react"
import { Sidebar } from "../Sidebar"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation()

  const { theme, sidebarOpen, language } = useAppSelector((state) => state.ui)
  const { searchQuery } = useAppSelector((state) => state.tasks.filters)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handleLanguageChange = (lang: "en" | "fr") => {
    dispatch(setLanguage(lang))
  }

  // ADD THIS HANDLER
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => dispatch(toggleSidebar())}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="relative flex-1 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks, projects..."
                  className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-0 h-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                    🇺🇸 English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
                    🇫🇷 Français
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(toggleTheme())}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === "dark" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === "light" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

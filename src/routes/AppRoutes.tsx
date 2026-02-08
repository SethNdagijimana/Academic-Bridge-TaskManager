import AppLayout from "@/components/layout/AppLayout"
import CalendarPage from "@/pages/CalendarPage"
import DashboardPage from "@/pages/DashboardPage"
import KanbanPage from "@/pages/KanbanPage"
import TablePage from "@/pages/TablePage"
import TeamPage from "@/pages/TeamPage"
import { Navigate, Route, Routes } from "react-router-dom"

export default function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/board" element={<KanbanPage />} />
        <Route path="/list" element={<TablePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  )
}

import AppLayout from "@/components/layout/AppLayout"
import KanbanPage from "@/pages/KanbanPage"
import TablePage from "@/pages/TablePage"
import { Navigate, Route, Routes } from "react-router-dom"

export default function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<KanbanPage />} />
        <Route path="/list" element={<TablePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  )
}

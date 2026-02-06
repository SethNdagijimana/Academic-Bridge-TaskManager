export const useTranslation = () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      createTask: "Create Task",
      editTask: "Edit Task",
      updateTask: "Update Task Details",
      SubTitle: "Fill in the details to create a new task",
      title: "Title",
      titleRequired: "Title is required",
      enterTitle: "Enter task title",
      description: "Description",
      enterDescription: "Enter task description",
      status: "Status",
      priority: "Priority",
      todo: "To Do",
      inProgress: "In Progress",
      done: "Done",
      low: "Low",
      medium: "Medium",
      high: "High",
      cancel: "Cancel"
    }
    return translations[key] || key
  },
  i18n: {
    changeLanguage: () => new Promise(() => {})
  }
})

export const Trans = ({ children }: { children: React.ReactNode }) => children

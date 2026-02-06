import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        kanban: "Kanban Board",
        table: "Task List",
        dashboard: "Dashboard",
        board: "Board",
        list: "List",
        calendar: "Calendar",
        team: "Team",

        theme: "Theme",
        addTask: "Add Task",
        newTask: "New Task",
        createTask: "Create Task",
        editTask: "Edit Task",
        updateTask: "Update Task",
        deleteTask: "Delete Task",
        SubTitle: "Add a new task to your board.",
        cancel: "Cancel",
        save: "Save",
        filter: "Filter",
        search: "Search",
        view: "View",

        title: "Title",
        description: "Description",
        status: "Status",
        priority: "Priority",
        progress: "Progress",
        dueDate: "Due Date",
        assignees: "Assignees",

        todo: "To Do",
        inProgress: "In Progress",
        done: "Done",

        low: "Low",
        medium: "Medium",
        high: "High",

        noTasks: "No tasks found",
        createFirstTask: "Create your first task",
        failedToLoad: "Failed to load tasks",
        retry: "Retry",
        confirmDelete: "Are you sure you want to delete this task?",

        searchPlaceholder: "Search tasks, projects...",
        enterTitle: "Enter task title",
        enterDescription: "Enter task description (optional)",

        totalTasks: "Total Tasks",
        completed: "Completed",

        hrTasksHub: "HR Tasks Hub",
        trackWorkflow: "Track and manage your team's workflow",
        taskListView: "View all tasks in table format",

        titleRequired: "Title is required",

        recentPages: "Recent Pages",
        recentProjects: "Recent Projects"
      }
    },
    fr: {
      translation: {
        kanban: "Tableau Kanban",
        table: "Liste des Tâches",
        dashboard: "Tableau de Bord",
        board: "Tableau",
        list: "Liste",
        calendar: "Calendrier",
        team: "Équipe",

        theme: "Thème",
        addTask: "Ajouter une Tâche",
        newTask: "Nouvelle Tâche",
        createTask: "Créer une Tâche",
        SubTitle: "Ajoutez une nouvelle tâche à votre tableau de bord.",
        editTask: "Modifier la Tâche",
        updateTask: "Mettre à Jour",
        deleteTask: "Supprimer la Tâche",
        cancel: "Annuler",
        save: "Enregistrer",
        filter: "Filtrer",
        search: "Rechercher",
        view: "Vue",

        title: "Titre",
        description: "Description",
        status: "Statut",
        priority: "Priorité",
        progress: "Progression",
        dueDate: "Date d'Échéance",
        assignees: "Assignés",

        todo: "À Faire",
        inProgress: "En Cours",
        done: "Terminé",

        low: "Basse",
        medium: "Moyenne",
        high: "Haute",

        noTasks: "Aucune tâche trouvée",
        createFirstTask: "Créez votre première tâche",
        failedToLoad: "Échec du chargement des tâches",
        retry: "Réessayer",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cette tâche?",

        searchPlaceholder: "Rechercher des tâches, projets...",
        enterTitle: "Entrez le titre de la tâche",
        enterDescription: "Entrez la description (optionnel)",

        totalTasks: "Total des Tâches",
        completed: "Terminées",

        hrTasksHub: "Centre des Tâches RH",
        trackWorkflow: "Suivez et gérez le flux de travail de votre équipe",
        taskListView: "Voir toutes les tâches en format tableau",

        titleRequired: "Le titre est requis",

        recentPages: "Pages Récentes",
        recentProjects: "Projets Récents"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
})

export default i18n

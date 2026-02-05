import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        kanban: "Kanban Board",
        table: "Task List",
        theme: "Theme"
      }
    },
    fr: {
      translation: {
        kanban: "Tableau Kanban",
        table: "Liste des tâches",
        theme: "Thème"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
})

export default i18n

import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/use-theme"

import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export default function Header() {
  const { toggleTheme } = useTheme()
  const { i18n, t } = useTranslation()

  return (
    <header className="flex items-center justify-between border-b p-4">
      <nav className="flex gap-4">
        <Link to="/" className="font-medium">
          {t("kanban")}
        </Link>
        <Link to="/list" className="font-medium">
          {t("table")}
        </Link>
      </nav>

      <div className="flex gap-2">
        <Button variant="outline" onClick={toggleTheme}>
          {t("theme")}
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            i18n.changeLanguage(i18n.language === "en" ? "fr" : "en")
          }
        >
          {i18n.language.toUpperCase()}
        </Button>
      </div>
    </header>
  )
}

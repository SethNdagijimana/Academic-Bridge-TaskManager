import { store } from "@/app/store"
import { QueryProvider } from "@/providers/QueryProvider"
import AppRoutes from "@/routes/AppRoutes"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import { I18nProvider } from "./providers/I18nProvider"
import { ThemeProvider } from "./providers/ThemeProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <I18nProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </I18nProvider>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  </React.StrictMode>
)

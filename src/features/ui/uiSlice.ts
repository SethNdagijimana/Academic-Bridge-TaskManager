import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  sidebarOpen: boolean
  theme: "light" | "dark"
  language: "en" | "fr"
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
  language: (localStorage.getItem("language") as "en" | "fr") || "en"
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", state.theme)
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
      localStorage.setItem("theme", state.theme)
    },
    setLanguage: (state, action: PayloadAction<"en" | "fr">) => {
      state.language = action.payload
      localStorage.setItem("language", state.language)
    }
  }
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  setLanguage
} = uiSlice.actions

export default uiSlice.reducer

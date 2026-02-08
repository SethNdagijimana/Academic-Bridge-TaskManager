import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",

  fullyParallel: true,

  retries: 1,

  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",

    screenshot: "only-on-failure",

    video: "retain-on-failure"
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],

  webServer: {
    command: "yarn dev",
    url: "http://localhost:5173",
    reuseExistingServer: true
  }
})

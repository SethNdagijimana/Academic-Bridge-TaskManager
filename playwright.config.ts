/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? [["html"], ["github"], ["list"]] : "html",

  use: {
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry"
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],

  webServer: {
    command: process.env.CI
      ? "npx vite preview --port 5173 --strictPort"
      : "yarn dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
})

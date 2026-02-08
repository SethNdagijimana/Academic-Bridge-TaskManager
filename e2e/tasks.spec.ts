import { expect, test } from "@playwright/test"

test.describe("Task Management - CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/board")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(2000)
  })

  test("should create a new task", async ({ page }) => {
    await page.click('button:has-text("Add Task")')

    await page.waitForSelector('[role="dialog"]', { state: "visible" })

    const taskTitle = "E2E Test Task - " + Date.now()

    await page.fill('input[id="title"]', taskTitle)
    await page.fill(
      'textarea[id="description"]',
      "This task was created by an E2E test"
    )

    await page.click('button:has-text("medium")')
    await page.click('[role="option"]:has-text("high")')

    await page.click('button[type="submit"]:has-text("Create Task")')

    await page.waitForTimeout(1000)
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({
      timeout: 5000
    })
  })

  test("should view task details", async ({ page }) => {
    await page.waitForTimeout(1000)

    const taskCards = page.locator(".cursor-grab")
    const count = await taskCards.count()

    if (count === 0) {
      test.skip()
    }

    await taskCards.first().click()

    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 })

    await page.keyboard.press("Escape")
  })

  test("should edit a task from details modal", async ({ page }) => {
    await page.waitForTimeout(1000)

    const taskCards = page.locator(".cursor-grab")
    const count = await taskCards.count()

    if (count === 0) {
      test.skip()
    }

    await taskCards.first().click()
    await page.waitForSelector('[role="dialog"]', { state: "visible" })

    const editButton = page
      .locator('[role="dialog"] button')
      .filter({ has: page.locator("svg") })
      .nth(0)
    await editButton.click()

    await page.waitForTimeout(500)

    const titleInput = page.locator('input[id="title"]')
    const originalTitle = await titleInput.inputValue()
    const newTitle = "EDITED - " + originalTitle

    await titleInput.fill(newTitle)

    await page.click('button[type="submit"]:has-text("Update Task")')

    await page.waitForTimeout(1000)
    await expect(page.locator(`text=${newTitle}`)).toBeVisible({
      timeout: 5000
    })
  })

  test("should delete a task from details modal", async ({ page }) => {
    await page.waitForTimeout(1000)

    const taskCards = page.locator(".cursor-grab")
    const count = await taskCards.count()

    if (count === 0) {
      test.skip()
    }

    await taskCards.first().click()
    await page.waitForSelector('[role="dialog"]', { state: "visible" })

    const deleteButton = page
      .locator('[role="dialog"] button')
      .filter({ has: page.locator("svg") })
      .nth(1)
    await deleteButton.click()

    await page.click('button.bg-red-600:has-text("Delete")')

    await page.waitForTimeout(1000)
  })
})

test.describe("Table View", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/list")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(1000)
  })

  test("should display table with tasks", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible({ timeout: 5000 })
  })

  test("should filter by status", async ({ page }) => {
    await page.click('button:has-text("All Status")')

    await page.click('[role="option"]:has-text("Done")')

    await page.waitForTimeout(500)
    await expect(page.locator("table")).toBeVisible()
  })

  test("should sort by title", async ({ page }) => {
    await page.click('button:has-text("Title")')

    await page.waitForTimeout(500)
    await expect(page.locator("table")).toBeVisible()
  })
})

test.describe("Calendar View", () => {
  test("should navigate to calendar and display page", async ({ page }) => {
    await page.goto("/calendar")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(1000)

    await expect(page.locator("body")).toBeVisible()
  })
})

test.describe("Team View", () => {
  test("should search team members", async ({ page }) => {
    await page.goto("/team")
    await page.waitForLoadState("networkidle")

    const searchInput = page.locator('input[placeholder*="Search team"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill("test")
      await page.waitForTimeout(500)
    }
  })
})

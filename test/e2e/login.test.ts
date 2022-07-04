import { PASSWORD } from "../utils/constants"
import { describe, test, expect } from "./baseFixture"

describe("login", false, [], {}, () => {
  test("should see the login page", async ({ codeServerPage }) => {
    // It should send us to the login page
    expect(await codeServerPage.page.title()).toBe("code-server login")
  })

  test("should be able to login", async ({ codeServerPage }) => {
    // Type in password
    await codeServerPage.page.locator(".password").fill(PASSWORD)
    // Click the submit button and login
    await codeServerPage.page.locator(".submit").click()
    await codeServerPage.page.waitForLoadState("networkidle")
    // We do this because occassionally code-server doesn't load on Firefox
    // but loads if you reload once or twice
    await codeServerPage.reloadUntilEditorIsReady()
    // Make sure the editor actually loaded
    await expect(codeServerPage.editor).toBeVisible()
  })

  test("should see an error message for missing password", async ({ codeServerPage }) => {
    // Skip entering password
    // Click the submit button and login
    await codeServerPage.page.locator(".submit").click()
    await codeServerPage.page.waitForLoadState("networkidle")
    await expect(codeServerPage.page.locator("text=Missing password")).toBeVisible()
  })

  test("should see an error message for incorrect password", async ({ codeServerPage }) => {
    // Type in password
    await codeServerPage.page.fill(".password", "password123")
    // Click the submit button and login
    await codeServerPage.page.locator(".submit").click()
    await codeServerPage.page.waitForLoadState("networkidle")
    await expect(codeServerPage.page.locator("text=Incorrect password")).toBeVisible()
  })

  test("should hit the rate limiter for too many unsuccessful logins", async ({ codeServerPage }) => {
    // Type in password
    await codeServerPage.page.fill(".password", "password123")
    // Click the submit button and login
    // The current RateLimiter allows 2 logins per minute plus
    // 12 logins per hour for a total of 14
    // See: src/node/routes/login.ts
    for (let i = 1; i <= 14; i++) {
      await codeServerPage.page.locator(".submit").click()
      await codeServerPage.page.waitForLoadState("networkidle")
      // We double-check that the correct error message shows
      // which should be for incorrect password
      await expect(codeServerPage.page.locator("text=Incorrect password")).toBeVisible()
    }

    // The 15th should fail for a different reason:
    // login rate
    await codeServerPage.page.locator(".submit").click()
    await codeServerPage.page.waitForLoadState("networkidle")
    await expect(codeServerPage.page.locator("text=Login rate limited!")).toBeVisible()
  })
})

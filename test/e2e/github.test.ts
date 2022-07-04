import { describe, expect, test } from "./baseFixture"

describe("With GitHub token", true, [], {}, () => {
  test.skip(!process.env.GITHUB_TOKEN, "GitHub token is not set")

  test("should be logged in to pull requests extension", async ({ codeServerPage }) => {
    await codeServerPage.exec("git init")
    await codeServerPage.exec("git remote add origin https://github.com/coder/code-server")
    await codeServerPage.installExtension("GitHub.vscode-pull-request-github")
    await codeServerPage.executeCommandViaMenus("View: Show Github")
    await codeServerPage.page.locator("text=Sign in").click()
    await codeServerPage.page.locator("text=Allow").click()
    // It should ask to select an account, one of which will be the one we
    // pre-injected.
    await expect(codeServerPage.page.locator("text=Select an account")).toBeHidden()
  })
})

describe("No GitHub token", true, [], { GITHUB_TOKEN: "" }, () => {
  test("should not be logged in to pull requests extension", async ({ codeServerPage }) => {
    await codeServerPage.exec("git init")
    await codeServerPage.exec("git remote add origin https://github.com/coder/code-server")
    await codeServerPage.installExtension("GitHub.vscode-pull-request-github")
    await codeServerPage.executeCommandViaMenus("View: Show Github")
    await codeServerPage.page.locator("text=Sign in").click()
    await codeServerPage.page.locator("text=Allow").click()
    // Since there is no account it will ask directly for the token (because
    // we are on localhost; otherwise it would initiate the oauth flow).
    await expect(codeServerPage.page.locator("text=GitHub Personal Access Token")).toBeHidden()
  })
})

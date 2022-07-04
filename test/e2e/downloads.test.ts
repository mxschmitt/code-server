import { promises as fs } from "fs"
import * as path from "path"
import { clean } from "../utils/helpers"
import { describe, test, expect } from "./baseFixture"

describe("Downloads (enabled)", true, [], {}, async () => {
  const testName = "downloads-enabled"
  test.beforeAll(async () => {
    await clean(testName)
  })

  test("should see the 'Download...' option", async ({ codeServerPage }) => {
    // Setup
    const workspaceDir = await codeServerPage.workspaceDir
    const tmpFilePath = path.join(workspaceDir, "unique-file.txt")
    await fs.writeFile(tmpFilePath, "hello world")

    // Action
    await codeServerPage.page.locator("text=unique-file.txt").click({
      button: "right",
    })

    await expect(codeServerPage.page.locator("text=Download...")).toBeVisible()
  })
})

describe("Downloads (disabled)", true, ["--disable-file-downloads"], {}, async () => {
  const testName = "downloads-disabled"
  test.beforeAll(async () => {
    await clean(testName)
  })

  test("should not see the 'Download...' option", async ({ codeServerPage }) => {
    // Setup
    const workspaceDir = await codeServerPage.workspaceDir
    const tmpFilePath = path.join(workspaceDir, "unique-file.txt")
    await fs.writeFile(tmpFilePath, "hello world")

    // Action
    await codeServerPage.page.locator("text=unique-file.txt").click({
      button: "right",
    })

    await expect(codeServerPage.page.locator("text=Download...")).toBeHidden()
  })
})

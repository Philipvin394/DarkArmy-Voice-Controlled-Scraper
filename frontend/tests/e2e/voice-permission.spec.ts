import { test, expect } from "@playwright/test";

test.describe("Voice console responsive and permission flow", () => {
  test("shows voice console and mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/voice-console");

    await expect(page.locator("text=Voice Command Center")).toBeVisible();
    await expect(
      page.locator("button:has-text('Start listening')"),
    ).toBeVisible();
  });

  test("prompts for microphone permission when voice start is clicked", async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/voice-console");
    await page.click("button:has-text('Start listening')");
    await expect(page.locator("text=Microphone Access Required")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Vendly/i);

  await expect(
    page.getByPlaceholder("Search stores and products...")
  ).toBeVisible();
});

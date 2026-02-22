import { test, expect } from "@playwright/test";

test("Check access to /c/personal", async ({ page }) => {
    await page.goto("/c/personal");
    console.log("URL after nav:", page.url());
    // If redirects to /c or login, we know we are blocked.
});

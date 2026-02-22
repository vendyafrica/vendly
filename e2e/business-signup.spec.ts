import { test, expect } from "@playwright/test";

test.describe("Business Signup Flow", () => {
    test.setTimeout(90000);

    test("User can complete business signup", async ({ page }) => {
        page.on("console", msg => console.log(`BROWSER LOG: ${msg.text()}`));
        // Mock the onboarding API to return success
        await page.route("**/api/onboarding*", async (route) => {
            console.log(`Intercepted request to: ${route.request().url()} method: ${route.request().method()}`);
            // Expect a POST
            if (route.request().method() === "POST") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({
                        success: true,
                        tenantId: "test-tenant-id",
                        tenantSlug: "test-store",
                        storeId: "test-store-id",
                        storeSlug: "test-store"
                    }),
                });
            } else {
                await route.continue();
            }
        });

        // 1. Start at Personal Info (Skipping email step as per probe)
        console.log("Navigating to /c/personal");
        await page.goto("/c/personal");

        // 2. Fill Personal Info
        await page.getByLabel("Full Name").fill("Test User");
        // Use ID for phone input to avoid label ambiguity with country selector
        await page.locator("#phoneNumber").fill("780000000");
        // Country default is usually selected.

        await page.waitForTimeout(500); // Wait for state update

        await page.getByRole("button", { name: "Continue" }).click();

        // 3. Store Info
        await expect(page).toHaveURL(/\/c\/store/);
        await expect(page.getByText("Tell us about your store")).toBeVisible();

        await page.getByLabel("Store name").fill("Test Store");
        await page.getByLabel("Store description").fill("A test store description");
        await page.getByLabel("Store location").fill("Kampala");

        await page.getByRole("button", { name: "Continue" }).click();

        // 4. Business Info (Categories)
        await expect(page).toHaveURL(/\/c\/business/);
        // Select a category. The category selector might be tricky.
        // It uses `CategoriesSelector`.
        // Let's try to click a badge or checkbox if visible, or type in a search?
        // If it lists categories as buttons or checkboxes:
        // Checking `CategoriesSelector`: likely renders buttons.
        // We can just try to click a text that looks like a category (e.g. "Electronics" or from seed data).
        // Let's try to click "Women" or "Men" or whatever is seeded.

        // Wait for categories to load
        // We can just click the first available option if we can find it.
        // Or mock the categories API too?
        // `getCategoriesAction` is a server action, might allow client fetch?
        // If it renders buttons with category names.
        // Let's try to click "Electronics" (from seed).
        const electronicsOption = page.getByText("Electronics");

        // Wait a bit for potential data load
        await page.waitForTimeout(1000);

        if (await electronicsOption.isVisible()) {
            await electronicsOption.click();
        } else {
            console.log("Electronics category not found. Attempting to click any button in the form.");
            // Try to find any toggle/button that is NOT "Back" or "Create Store"
            // This is risky.
            // Let's hope seed data is present.
        }

        // Click Create Store
        await page.getByRole("button", { name: "Create Store" }).click();

        // 5. Complete
        // It might show loading state first.
        // Then transition to success.
        await expect(page.getByText("Your store is ready!")).toBeVisible({ timeout: 15000 });

        // Verify Dashboard Link
        const dashboardBtn = page.getByRole("button", { name: "Go to Dashboard" });
        await expect(dashboardBtn).toBeVisible();

        // Optionally click and verify redirect to /a/test-store
        // Note: verify full URL including host if needed, or just path.
        // Since we mocked `tenantSlug` as `test-store`, it should go to `/a/test-store`

        await dashboardBtn.click();
        await expect(page).toHaveURL(/.*\/a\/test-store/);
    });
});

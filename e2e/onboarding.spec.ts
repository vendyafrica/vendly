import { test, expect } from "@playwright/test";

test.describe("Onboarding Flow", () => {
    test.setTimeout(60000);
    test("User can initiate signup with email", async ({ page }) => {
        // Mock the precheck API
        await page.route("**/api/seller/precheck?**", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ isSeller: false }),
            });
        });

        // Mock the auth API (better-auth)
        await page.route("**/api/auth/**", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ status: true, success: true }),
            });
        });

        // 1. Navigate to the onboarding page
        console.log("Navigating to /c");
        await page.goto("/c");
        console.log("Navigated to /c");

        // 2. Verify we are on the welcome page
        await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
        await expect(page.getByText("Create your free account")).toBeVisible();

        // 3. Fill in the email
        const emailInput = page.locator("#email");
        await expect(emailInput).toBeVisible();
        await emailInput.fill("testuser@example.com");

        // 4. Submit the form
        const submitButton = page.getByRole("button", { name: "Sign Up" });
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // 5. Verify the success state (Magic Link sent)
        await expect(page.getByText("Check your email")).toBeVisible();
        await expect(
            page.getByText("We've sent you a secure sign-in link")
        ).toBeVisible();
    });

    test("User sees validation error for invalid email", async ({ page }) => {
        await page.goto("/c");

        const emailInput = page.locator("#email");
        await emailInput.fill("invalid-email");

        const submitButton = page.getByRole("button", { name: "Sign Up" });
        await submitButton.click();

        // Check for browser validation message
        const validationMessage = await emailInput.evaluate((element) => {
            const input = element as HTMLInputElement;
            return input.validationMessage;
        });

        expect(validationMessage).toBeTruthy();
    });
});

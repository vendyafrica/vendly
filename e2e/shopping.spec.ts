import { test, expect } from "@playwright/test";

test.describe("Shopping Flow", () => {
    test.setTimeout(90000);

    test("User can browse store, add to cart and wishlist", async ({ page }) => {
        // 1. Navigate to Home
        console.log("Navigating to home page");
        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");

        // 2. Check if we have stores
        const noStoresMessage = page.getByText("No stores yet");
        if (await noStoresMessage.isVisible()) {
            console.log("No stores found. Skipping shopping test.");
            test.skip();
            return;
        }

        // 3. Click on the first store card
        // Store cards are inside CategoryShelf > Carousel > CarouselItem > Link
        // The link has href starting with "/" and class "group"
        console.log("Looking for a store...");

        // Wait for carousel items to be present
        await page.waitForSelector("a[href^='/'].group");

        // Exclude common non-store links if any match the selector (e.g. hero buttons)
        // Store links usually have an image and a title inside.
        // We pick the first one from the shelves (which are typically lower down)
        // or just the very first one found.

        const storeLink = page.locator("a[href^='/'].group").first();
        const storeHref = await storeLink.getAttribute("href");
        console.log(`Navigating to store: ${storeHref}`);

        await Promise.all([
            page.waitForURL(`**${storeHref}`),
            storeLink.click()
        ]);

        // 4. On Store Page
        console.log("On store page");
        // Verify we are on a store page by checking for "All Products" heading or product grid
        // apps/web/src/app/[s]/page.tsx renders <ProductGrid /> which has "All Products" heading sometimes, 
        // or just check for products.
        // The page layout has "All Products" text.
        await expect(page.getByText("All Products")).toBeVisible();

        // 5. Click on a product
        // Product cards have href like `/${currentStoreSlug}/${id}/${slug}`
        // and class "group block"

        const productLink = page.locator("a[href*='/'][class*='group']").filter({ has: page.locator("h3") }).first();
        // Wait for product grid
        await page.waitForSelector("a[class*='group']");

        const productHref = await productLink.getAttribute("href");
        console.log(`Clicking product: ${productHref}`);

        await Promise.all([
            page.waitForURL(`**${productHref}`),
            productLink.click()
        ]);

        // 6. On Product Page
        console.log("On product page");

        // "Add to Bag" button
        const addToBagBtn = page.getByRole("button", { name: /Add to Bag/i });
        await expect(addToBagBtn).toBeVisible();
        await addToBagBtn.click();

        // Verify "Added to Bag" state
        await expect(page.getByText("Added to Bag")).toBeVisible();

        // 7. Wishlist
        const wishlistBtn = page.getByRole("button", { name: /Save to Wishlist/i });
        if (await wishlistBtn.isVisible()) {
            await wishlistBtn.click();
            await expect(page.getByText("Saved to Wishlist")).toBeVisible();
        }

        // 8. Go to Cart
        // Click the cart icon in the header
        const cartLink = page.locator("a[href='/cart']");
        await expect(cartLink).toBeVisible();
        await cartLink.click();

        // 9. Verify Cart Page
        await expect(page).toHaveURL(/.*\/cart/);
        console.log("On cart page");

        // Check if item is in cart
        // Logic depends on cart page implementation, but usually distinct text/price is visible.
        // For now, just ensure we are on the page and it's not empty (unless we added nothing?)
        // If we added to bag, it should be there.
        await expect(page.getByText("Checkout")).toBeVisible();
        // optionally click checkout
        // await page.getByText("Checkout").click();
    });
});

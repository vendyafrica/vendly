import { Router } from "express";
import { storeController } from "../controllers/store.controller";
import { themeController } from "../controllers/theme.controller";
import { pageController } from "../controllers/page.controller";

// Middleware placeholders (should be imported from actual middleware files)
const authenticate = (req: any, res: any, next: any) => next();
const requireTenant = (req: any, res: any, next: any) => next();

export const createStorefrontRouter = (): Router => {
    const router = Router();

    router.use(authenticate);
    // router.use(requireTenant); // May not apply to all if some are public fetch

    // Store Routes
    router.post("/stores", storeController.createStore.bind(storeController));
    router.get("/stores/:storeId", storeController.getStore.bind(storeController));

    // Theme Routes
    router.get("/templates", themeController.getTemplates.bind(themeController));
    router.get("/stores/:storeId/theme", themeController.getTheme.bind(themeController));
    router.patch("/stores/:storeId/theme", themeController.updateTheme.bind(themeController));

    // Page Routes
    router.get("/stores/:storeId/pages", pageController.getPages.bind(pageController));
    router.post("/stores/:storeId/pages", pageController.createPage.bind(pageController));

    // Page Editor Routes
    router.get("/stores/:storeId/pages/:pageId", pageController.getPage.bind(pageController)); // treating pageId as slug for now based on controller
    router.patch("/stores/:storeId/pages/:pageId", pageController.updatePage.bind(pageController)); // pageId is UUID here
    router.post("/stores/:storeId/pages/:pageId/publish", pageController.publishPage.bind(pageController)); // pageId is UUID here

    return router;
};

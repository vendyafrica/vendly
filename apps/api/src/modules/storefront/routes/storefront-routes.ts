import { Router } from "express";
import { storeController } from "../controllers/store-controller";

const authenticate = (req: any, res: any, next: any) => next();

export const createStorefrontRouter = (): Router => {
    const router = Router();

    router.use(authenticate);

    // Store Routes
    router.post("/stores", storeController.createStore.bind(storeController));
    router.get("/stores/:storeId", storeController.getStore.bind(storeController));

    return router;
};

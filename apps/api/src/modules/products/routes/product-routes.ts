import { Router } from "express";

const authenticate = (req: any, res: any, next: any) => next();

export const createProductRouter = (): Router => {
    const router = Router();

    router.use(authenticate);


    return router;
};

import { Router } from "express";
import { storefrontOrdersRouter } from "./storefront-orders";
import { tenantOrdersRouter } from "./tenant-orders";
import { orderSimulationsRouter } from "./order-simulations";
import { whatsappRouter } from "./whatsapp";
import { whatsappTemplatesRouter } from "./whatsapp-templates";

export const apiRouter = Router();

apiRouter.use(storefrontOrdersRouter);
apiRouter.use(tenantOrdersRouter);
apiRouter.use(orderSimulationsRouter);
apiRouter.use(whatsappRouter);
apiRouter.use(whatsappTemplatesRouter);

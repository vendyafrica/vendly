import { Router } from "express";
import { storefrontOrdersRouter } from "./storefront-orders";
import { storefrontPaymentsRouter } from "./storefront-payments";
import { tenantOrdersRouter } from "./tenant-orders";
import { orderSimulationsRouter } from "./order-simulations";
import { whatsappRouter } from "./whatsapp";
import { whatsappTemplatesRouter } from "./whatsapp-templates";
import { mtnMomoRouter } from "./mtn-momo";
import { instagramWebhookRouter } from "./instagram-webhooks";

export const apiRouter:Router = Router();

apiRouter.use(storefrontOrdersRouter);
apiRouter.use(storefrontPaymentsRouter);
apiRouter.use(tenantOrdersRouter);
apiRouter.use(orderSimulationsRouter);
apiRouter.use(whatsappRouter);
apiRouter.use(whatsappTemplatesRouter);
apiRouter.use(mtnMomoRouter);
apiRouter.use(instagramWebhookRouter);

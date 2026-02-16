import { Router } from "express";

import { storefrontOrdersRouter } from "../modules/orders/storefront-orders.routes";
import { tenantOrdersRouter } from "../modules/orders/tenant-orders.routes";
import { orderSimulationsRouter } from "../modules/orders/order-simulations-routes";
import { storefrontPaymentsRouter } from "../modules/payments/storefront-payments.routes";
import { mtnMomoRouter } from "../modules/payments/mtn-momo.routes";
import { whatsappRouter } from "../modules/messaging/whatsapp/whatsapp-webhook.routes";
import { whatsappDeliveryRouter } from "../modules/messaging/whatsapp/whatsapp-delivery.routes";
import { whatsappTemplatesRouter } from "../modules/messaging/whatsapp/whatsapp-templates.routes";
import { instagramWebhookRouter } from "../modules/social/instagram/instagram-webhook.routes";

export const apiRouter: Router = Router();

apiRouter.use(storefrontOrdersRouter);
apiRouter.use(storefrontPaymentsRouter);
apiRouter.use(tenantOrdersRouter);
apiRouter.use(orderSimulationsRouter);
apiRouter.use(whatsappRouter);
apiRouter.use(whatsappDeliveryRouter);
apiRouter.use(whatsappTemplatesRouter);
apiRouter.use(mtnMomoRouter);
apiRouter.use(instagramWebhookRouter);

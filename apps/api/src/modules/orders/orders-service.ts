export {
  orderService,
  orderItemInputSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from "../../services/order-service";

export type {
  OrderItemInput,
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderWithItems,
} from "../../services/order-service";

import { productRepository } from "./product-repository";
import { ProductService } from "./product-service";
import { mediaService } from "../media";

export const productService = new ProductService(
  productRepository,
  mediaService
);

export * from "./product-controller";
export * from "./product-routes";

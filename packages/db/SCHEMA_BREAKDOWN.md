# Commerce Schema Breakdown

The `commerce-schema.ts` file has been refactored into multiple modular schema files based on related functionality. This improves code organization, maintainability, and makes it easier to understand the different domains of the e-commerce system.

## New Schema Files

### 1. **customer-schema.ts**
Contains customer-related tables:
- `platformAdmins` - Platform administrators with roles
- `customers` - Customer profiles linked to tenants and users
- `customerAddresses` - Customer shipping and billing addresses

**Relations**: Customers have many addresses

### 2. **cart-schema.ts**
Contains shopping cart tables:
- `carts` - Shopping carts for customers
- `cartItems` - Individual items in shopping carts

**Relations**: Carts belong to customers and have many cart items; cart items reference product variants

### 3. **order-schema.ts**
Contains order management tables:
- `orders` - Customer orders with status tracking
- `orderItems` - Line items in orders
- `orderAddresses` - Shipping and billing addresses for orders
- `orderStatusEvents` - Audit trail of order status changes

**Relations**: Orders have many items, addresses, and status events; order items reference products and variants

### 4. **payment-schema.ts**
Contains payment processing tables:
- `paymentProviders` - Configured payment providers per tenant
- `paymentIntents` - Payment intentions for orders
- `paymentAttempts` - Individual payment attempts
- `refunds` - Refund records for orders

**Relations**: Payment intents belong to orders and have many attempts; refunds reference orders and payment intents

### 5. **shipping-schema.ts**
Contains shipping and fulfillment tables:
- `shippingMethods` - Available shipping methods per tenant
- `shipments` - Shipment records for orders
- `shipmentItems` - Items included in each shipment
- `shipmentEvents` - Tracking events for shipments

**Relations**: Shipments belong to orders and have many items and events; shipment items reference order items

### 6. **inventory-schema.ts**
Contains inventory management tables:
- `stockLocations` - Warehouse/stock locations
- `inventoryLevels` - Stock levels per variant per location
- `inventoryMovements` - Audit trail of inventory changes

**Relations**: Inventory levels and movements reference product variants and stock locations

## Backward Compatibility

The original `commerce-schema.ts` file now re-exports all tables, relations, and types from the new modular files:

```typescript
export * from "./customer-schema";
export * from "./cart-schema";
export * from "./order-schema";
export * from "./payment-schema";
export * from "./shipping-schema";
export * from "./inventory-schema";
```

This means existing code that imports from `commerce-schema.ts` will continue to work without any changes.

## Benefits

1. **Better Organization**: Related tables are grouped together logically
2. **Easier Navigation**: Smaller files are easier to understand and navigate
3. **Reduced Complexity**: Each file focuses on a specific domain
4. **Maintainability**: Changes to one domain don't affect others
5. **Scalability**: Easy to add new tables to the appropriate schema file
6. **No Breaking Changes**: Existing imports continue to work

## Import Structure

All schema files follow this pattern:
- Import base types from `drizzle-orm`
- Import core schemas (`tenants`, `users`) from `./core-schema`
- Import product schemas from `./product-schema` where needed
- Import enums from `../enums/`
- Define tables
- Define relations
- Export types

## Circular Dependency Prevention

To avoid circular dependencies:
- Customer schema doesn't directly reference carts or orders in relations
- Order schema doesn't reference payment intents, refunds, or shipments in relations
- Relations are defined only in the "owning" schema (e.g., cart relations reference customers, not vice versa)

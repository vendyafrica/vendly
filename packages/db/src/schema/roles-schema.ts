import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const platformRoles = pgTable(
    "platform_roles",
    {
        userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        role: text("role").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("platform_roles_name_idx").on(table.name)],
)
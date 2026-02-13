import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),
    address: text("address"),
    company: text("company"),
    jobTitle: text("job_title"),
    isFavorite: boolean("is_favorite").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

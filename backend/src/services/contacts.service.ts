import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";
import { NewContact } from "../types/contact.types.js";
import { eq } from "drizzle-orm";

export const createContact = async (data: NewContact) => {
    const result = await db.insert(contacts).values(data).returning();
    return result[0];
};

import { sql } from "drizzle-orm";

export const getAllContacts = async (page: number = 1, limit: number = 10, search?: string) => {
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
        whereClause = sql`${contacts.name} ILIKE ${`%${search}%`} OR ${contacts.company} ILIKE ${`%${search}%`}`;
    }

    const [totalCountResult] = await db
        .select({ count: sql<number>`cast(count(${contacts.id}) as int)` })
        .from(contacts)
        .where(whereClause);

    const total = totalCountResult.count;
    const totalPages = Math.ceil(total / limit);

    const data = await db
        .select()
        .from(contacts)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(contacts.createdAt);

    return {
        data,
        meta: {
            total,
            page,
            totalPages,
            limit
        }
    };
};

export const getContactById = async (id: number) => {
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
};

export const updateContact = async (id: number, data: Partial<NewContact>) => {
    const result = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return result[0];
};

export const deleteContact = async (id: number) => {
    const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
    return result[0];
};

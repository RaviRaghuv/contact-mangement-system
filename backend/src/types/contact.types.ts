import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    isFavorite: z.boolean().default(false),
});

export type NewContact = z.infer<typeof contactSchema>;

export const partialContactSchema = contactSchema.partial();

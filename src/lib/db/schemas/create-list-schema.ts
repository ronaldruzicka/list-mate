import { z } from 'zod';

export const createListSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type CreateListSchema = z.infer<typeof createListSchema>;

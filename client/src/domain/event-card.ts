import { z } from 'zod';
import { TagSchema } from './tag';

export const EventCardSchema = z.object({
    title: z.string(),
    publisher: z.string(),
    publisherIcon: z.string(),
    datetime: z.string(),
    tags: TagSchema.array(),
    imageUrl: z.string(),
    liked: z.boolean(),
    handleEventClose: z.function(),
});

export type EventCardType = z.infer<typeof EventCardSchema>;
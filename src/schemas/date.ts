import { isBefore } from 'date-fns';
import { z } from 'zod';

export const dateSchema = z
  .object({
    startOn: z.string().min(1),
    endAfter: z.string().min(1)
  })
  .refine((data) => isBefore(data.startOn, data.endAfter), {
    message: 'Must be before the end date',
    path: ['startOn']
  })
  .refine((data) => isBefore(data.startOn, data.endAfter), {
    message: 'Must be after the start date',
    path: ['endAfter']
  });

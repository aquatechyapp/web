import { z } from 'zod';
import { isBefore } from 'date-fns';

export const dateSchema = z
  .object({
    startOn: z.coerce.date(),
    endAfter: z.coerce.date()
  })
  .refine((data) => isBefore(data.startOn, data.endAfter), {
    message: 'Must be before the end date',
    path: ['startOn']
  })
  .refine((data) => isBefore(data.startOn, data.endAfter), {
    message: 'Must be after the start date',
    path: ['endAfter']
  });
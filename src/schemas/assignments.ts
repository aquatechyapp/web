import { z } from 'zod';

import { dateSchema } from './date';
import { defaultSchemas } from './defaultSchemas';

export const paidByServiceSchema = z.object({
  paidByService: z.number()
});

export const transferAssignmentsSchema = z
  .object({
    assignmentToId: z.string(),
    weekday: defaultSchemas.weekday,
    type: z.enum(['once', 'permanently']),
    onlyAt: z.string().optional(),
    isEntireRoute: z.boolean(),
    paidByService: defaultSchemas.monthlyPayment
  })
  .and(dateSchema);

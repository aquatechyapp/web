import { z } from 'zod';
import { dateSchema } from '@/schemas/date';

import { defaultSchemas } from './defaultSchemas';

export const transferAssignmentsSchema = z.object({
  assignmentToId: z
    .string({
      required_error: 'assignmentToId is required',
      invalid_type_error: 'assignmentToId must be a string'
    })
    .trim()
    .min(1, { message: 'assignmentToId must be at least 1 characters' }),
  weekday: defaultSchemas.weekday,
  isEntireRoute: z.boolean({
    required_error: 'isEntireRoute is required',
    invalid_type_error: 'isEntireRoute must be a boolean'
  }),
  startOn: z.coerce
    .date({
      required_error: 'startOn is required',
      invalid_type_error: 'startOn must be a date'
    })
    .optional(),
  endAfter: z
    .string({
      required_error: 'endAfter is required',
      invalid_type_error: 'endAfter must be a string'
    })
    .optional()
});

export const newAssignmentSchema = z
  .object({
    assignmentToId: z.string().min(1),
    poolId: z.string(),
    client: z.string(),
    serviceTypeId: z.string().min(1, 'Service type is required'),
    frequency: defaultSchemas.frequency,
    weekday: defaultSchemas.weekday
  })
  .and(dateSchema);

import { isBefore } from 'date-fns';
import { z } from 'zod';

import { defaultSchemas } from './defaultSchemas';

export const paidByServiceSchema = z.object({
  paidByService: z.number()
});

export const transferAssignmentsSchema = z
  .object({
    assignmentToId: z.string(),
    weekday: defaultSchemas.weekday,
    type: z.enum(['once', 'permanently']),
    onlyAt: z.coerce.date().optional(),
    isEntireRoute: z.boolean(),
    paidByService: defaultSchemas.monthlyPayment,
    startOn: z.coerce.date().optional(),
    endAfter: z.date().optional()
  })
  .refine((data) => (data.type === 'once' ? !!data.onlyAt : true), {
    message: 'Only at is required',
    path: ['onlyAt']
  })
  .refine((data) => (data.type === 'permanently' ? !!data.startOn : true), {
    message: 'Start on are required',
    path: ['startOn']
  })
  .refine((data) => (data.type === 'permanently' ? !!data.endAfter : true), {
    message: 'End after are required',
    path: ['endAfter']
  })
  .refine((data) => (data.type === 'permanently' ? isBefore(data.startOn!, data.endAfter!) : true), {
    message: 'Must be before the end date',
    path: ['startOn']
  })
  .refine((data) => (data.type === 'permanently' ? isBefore(data.startOn!, data.endAfter!) : true), {
    message: 'Must be after the start date',
    path: ['endAfter']
  });

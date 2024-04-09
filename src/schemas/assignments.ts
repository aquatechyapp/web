import { z } from 'zod';
import { isBefore } from 'date-fns';

export const paidByServiceSchema = z.object({
  paidByService: z.preprocess((val) => {
    if (!val) return val;
    return parseInt(val?.toString().replaceAll(/\D/g, ''));
  }, z.number())
});

export const transferAssignmentsSchema = z
  .object({
    assignmentToId: z.string(),
    weekday: z.string(),
    type: z.enum(['once', 'permanently']),
    onlyAt: z.coerce.date().optional(),
    startOn: z.coerce.date().optional(),
    endAfter: z.coerce.date().optional(),
    isEntireRoute: z.boolean()
  })
  .and(paidByServiceSchema)
  .refine((data) => (data.type === 'once' ? data.onlyAt : true), {
    message: 'Is required',
    path: ['onlyAt']
  })
  .refine(
    (data) =>
      data.type === 'once' ? true : isBefore(data.startOn, data.endAfter),
    {
      message: 'Must be before the end date',
      path: ['startOn']
    }
  )
  .refine(
    (data) =>
      data.type === 'once' ? true : isBefore(data.startOn, data.endAfter),
    {
      message: 'Must be after the start date',
      path: ['endAfter']
    }
  );

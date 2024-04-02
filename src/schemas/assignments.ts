import { z } from 'zod';
import { isBefore } from 'date-fns';
import Cookies from 'js-cookie';

export const transferAssignmentsSchema = z
  .object({
    assignmentToId: z.string(),
    weekday: z.string(),
    type: z.enum(['once', 'permanently']),
    onlyAt: z.coerce.date().optional(),
    startOn: z.coerce.date().optional(),
    endAfter: z.coerce.date().optional(),
    paidByService: z.string().nullish()
  })
  .refine(
    (data) =>
      Cookies.get('userId') !== data.assignmentToId ? data.paidByService : true,
    {
      message: 'Is required',
      path: ['paidByService']
    }
  )
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

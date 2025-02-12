import { z } from 'zod';

export const transferServiceSchema = z.object({
  serviceId: z
    .string({
      required_error: 'serviceId is required.',
      invalid_type_error: 'serviceId must be a string.'
    })
    .trim()
    .min(1, { message: 'serviceId must be at least 1 character.' }),
  poolId: z
    .string({
      required_error: 'poolId is required.',
      invalid_type_error: 'poolId must be a string.'
    })
    .trim()
    .min(1, { message: 'poolId must be at least 1 character.' }),
  assignedToId: z
    .string({
      required_error: 'assignedToId is required.',
      invalid_type_error: 'assignedToId must be a string.'
    })
    .trim()
    .min(1, { message: 'assignedToId must be at least 1 character.' }),
  scheduledTo: z
    .string({
      required_error: 'scheduledTo is required.',
      invalid_type_error: 'scheduledTo must be a string.'
    })
    .trim()
    .min(1, { message: 'scheduledTo must be at least 1 character.' })
});

export const newServiceSchema = z.object({
  poolId: z
    .string({
      required_error: 'poolId is required.',
      invalid_type_error: 'poolId must be a string.'
    })
    .trim()
    .min(1, { message: 'poolId must be at least 1 character.' }),
  assignedToId: z
    .string({
      required_error: 'assignedToId is required.',
      invalid_type_error: 'assignedToId must be a string.'
    })
    .trim()
    .min(1, { message: 'assignedToId must be at least 1 character.' }),
  scheduledTo: z
    .string({
      required_error: 'scheduledTo is required.',
      invalid_type_error: 'scheduledTo must be a string.'
    })
    .trim()
    .min(1, { message: 'scheduledTo must be at least 1 character.' }),
  clientId: z
    .string({
      required_error: 'clientId is required.',
      invalid_type_error: 'clientId must be a string.'
    })
    .trim()
    .min(1, { message: 'clientId must be at least 1 character.' })
});

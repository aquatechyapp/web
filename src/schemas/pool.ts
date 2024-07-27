import * as z from 'zod';

import { defaultSchemas } from './defaultSchemas';

const { address, city, notes, state, zipCode, poolType } = defaultSchemas;

export const poolSchema = z.object({
  poolAddress: address,
  animalDanger: z.boolean({
    required_error: 'Animal danger is required.',
    invalid_type_error: 'Animal danger must be a boolean.'
  }),
  poolCity: city,
  // coords: z.object({
  //     lat: z.string({
  //         required_error: "Latitude is required.",
  //         invalid_type_error: "Latitude must be a string.",
  //     }).trim().min(1, { message: "Latitude must be at least 1 character." }),
  //     lng: z.string({
  //         required_error: "Longitude is required.",
  //         invalid_type_error: "Longitude must be a string.",
  //     }).trim().min(1, { message: "Longitude must be at least 1 character." }),
  // }),
  enterSide: z
    .string({
      required_error: 'Enter side is required.',
      invalid_type_error: 'Enter side must be a string.'
    })
    .trim()
    .min(1, { message: 'Enter side must be at least 1 character.' }),
  lockerCode: z
    .string({
      required_error: "lockerCode field is required, even if it's null.",
      invalid_type_error: 'Locker code must be a string.'
    })
    .nullable(),

  poolNotes: notes,
  poolType: z.enum(['Chlorine', 'Salt', 'Other'], {
    required_error: 'poolType is required.',
    invalid_type_error: "Pool type must be 'Chlorine', 'Salt' or 'Other'."
  }),
  poolState: state,
  poolZip: zipCode
});

export const editPoolSchema = z.object({
  poolId: z
    .string({
      required_error: 'poolId is required.',
      invalid_type_error: 'poolId must be a string.'
    })
    .trim()
    .min(1, { message: 'poolId must be at least 1 character.' }),
  address: address.optional(),
  city: city.optional(),
  enterSide: z
    .string({
      required_error: 'enterSide is required.',
      invalid_type_error: 'enterSide must be a string.'
    })
    .trim()
    .min(1, { message: 'enterSide must be at least 1 character.' })
    .optional(),
  lockerCode: z
    .string({
      required_error: "lockerCode field is required, even if it's null.",
      invalid_type_error: 'lockerCode must be a string.'
    })
    .optional(),
  state: defaultSchemas.state.optional(),
  notes: notes.optional(),
  monthlyPayment: defaultSchemas.monthlyPayment.optional(),
  poolType: poolType.optional()
});

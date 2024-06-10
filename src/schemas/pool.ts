import * as z from 'zod';

export const poolSchema = z.object({
  poolAddress: z
    .string({
      required_error: 'Address is required.',
      invalid_type_error: 'Address must be a string.'
    })
    .trim()
    .min(1, { message: 'Address must be at least 1 character.' }),
  animalDanger: z.boolean({
    required_error: 'Animal danger is required.',
    invalid_type_error: 'Animal danger must be a boolean.'
  }),
  poolCity: z
    .string({
      required_error: 'City is required.',
      invalid_type_error: 'City must be a string.'
    })
    .trim()
    .min(1, { message: 'City must be at least 1 character.' }),
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
  // input is a string but I need to transform into a number

  poolNotes: z
    .string({
      required_error: 'Notes is required.',
      invalid_type_error: 'Notes must be a string.'
    })
    .trim()
    // .min(1, { message: 'Notes must be at least 1 character.' })
    .nullable(),
  poolType: z.enum(['Chlorine', 'Salt', 'Other'], {
    required_error: 'poolType is required.',
    invalid_type_error: "Pool type must be 'Chlorine', 'Salt' or 'Other'."
  }),
  poolState: z
    .string({
      required_error: 'State is required.',
      invalid_type_error: 'State must be a string.'
    })
    .trim()
    .length(2, { message: 'State must be 2 characters.' }),
  poolZip: z
    .string({
      required_error: 'Zip is required.',
      invalid_type_error: 'Zip must be a string.'
    })
    .trim()
    .min(5, { message: 'Zip must be between 5 and 10 (with hifen) digits.' })
});

export const editPoolSchema = z.object({
  isActive: z
    .boolean({
      invalid_type_error: 'isActive must be a boolean.'
    })
    .optional(),
  poolId: z
    .string({
      required_error: 'poolId is required.',
      invalid_type_error: 'poolId must be a string.'
    })
    .trim()
    .min(1, { message: 'poolId must be at least 1 character.' }),
  address: z
    .string({
      required_error: 'address is required.',
      invalid_type_error: 'address must be a string.'
    })
    .trim()
    .min(1, { message: 'address must be at least 1 character.' })
    .optional(),
  animalDanger: z
    .boolean({
      required_error: 'animalDanger is required.',
      invalid_type_error: 'animalDanger must be a boolean.'
    })
    .optional(),
  city: z
    .string({
      required_error: 'city is required.',
      invalid_type_error: 'city must be a string.'
    })
    .trim()
    .min(1, { message: 'city must be at least 1 character.' })
    .optional(),
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
  monthlyPayment: z
    .number({
      invalid_type_error: 'montlyPayment must be a number.'
    })
    .optional(),
  notes: z
    .string({
      invalid_type_error: 'notes must be a string.'
    })
    .optional(),
  poolType: z
    .enum(['Chlorine', 'Salt', 'Other'], {
      required_error: 'poolType is required.',
      invalid_type_error: "poolType must be 'Chlorine', 'Salt' or 'Other'."
    })
    .optional(),
  state: z
    .string({
      required_error: 'state is required.',
      invalid_type_error: 'state must be a string.'
    })
    .trim()
    .length(2, { message: 'state must be 2 characters.' })
    .optional(),
  zip: z
    .string({
      required_error: 'zip is required.',
      invalid_type_error: 'zip must be a string.'
    })
    .trim()
    .min(5, { message: 'zip must be between 5 and 10 (with hifen) digits.' })
    .optional()
});

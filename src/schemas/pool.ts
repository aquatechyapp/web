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

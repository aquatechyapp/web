import * as z from 'zod';

export const clientSchemaOld = z.object({
  address: z
    .string({
      required_error: 'Address is required.',
      invalid_type_error: 'Address must be a string.'
    })
    .trim()
    .min(1, { message: 'Address must be at least 1 character.' }),
  city: z
    .string({
      required_error: 'City is required.',
      invalid_type_error: 'City must be a string.'
    })
    .trim()
    .min(1, { message: 'City must be at least 1 character.' }),
  email1: z
    .string({
      required_error: 'E-mail is required.'
    })
    .email({ message: 'Invalid e-mail.' }),
  firstName: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, { message: 'Name must be at least 1 character.' }),
  lastName: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, { message: 'Name must be at least 1 character.' }),
  phone: z.preprocess(
    (value) => value.replace(/\D/g, '').slice(1),
    z
      .string({
        required_error: 'Name is required.',
        invalid_type_error: 'Name must be a string.'
      })
      .length(10, { message: 'Phone number must be 10 digits.' })
  ),

  state: z
    .string({
      required_error: 'State is required.',
      invalid_type_error: 'State must be a string.'
    })
    .trim()
    .length(2, { message: 'State must be 2 characters.' }),
  zip: z
    .string({
      required_error: 'Zip is required.',
      invalid_type_error: 'Zip must be a string.'
    })
    .trim()
    .min(5, { message: 'Zip must be between 5 and 10 (with hifen) digits.' })
});

export const clientSchema = z.object({
  clientAddress: z
    .string({
      required_error: 'Address is required.',
      invalid_type_error: 'Address must be a string.'
    })
    .trim()
    .min(1, { message: 'Address must be at least 1 character.' }),
  clientCity: z
    .string({
      required_error: 'City is required.',
      invalid_type_error: 'City must be a string.'
    })
    .trim()
    .min(1, { message: 'City must be at least 1 character.' }),
  email1: z
    .string({
      required_error: 'E-mail is required.'
    })
    .email({ message: 'Invalid e-mail.' }),
  firstName: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, { message: 'First name must be at least 1 character.' }),
  lastName: z
    .string({
      required_error: 'Last name is required.',
      invalid_type_error: 'Last name must be a string.'
    })
    .trim()
    .min(1, { message: 'Last name must be at least 1 character.' }),
  clientNotes: z
    .string()
    .trim()
    // .min(1, { message: 'Notes must be at least 1 character.' })
    .optional(),
  phone1: z.string().max(20, { message: 'Phone number too large.' }),
  clientState: z
    .string({
      required_error: 'State is required.',
      invalid_type_error: 'State must be a string.'
    })
    .trim()
    .length(2, { message: 'State must be 2 characters.' }),
  clientZip: z
    .string({
      required_error: 'Zip is required.',
      invalid_type_error: 'Zip must be a string.'
    })
    .trim()
    .min(5, { message: 'Zip must be between 5 and 10 (with hifen) digits.' })
});

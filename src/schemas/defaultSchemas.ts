import { z } from 'zod';

function commonStringSchema(message: string, min: number = 1) {
  return z
    .string({
      required_error: `${message} is required.`,
      invalid_type_error: `${message} must be a string.`
    })
    .trim()
    .min(min, { message: `${message} must be at least ${min} character.` });
}

export const defaultSchemas = {
  stringOptional: z.string().optional(),
  address: commonStringSchema('Address'),
  city: commonStringSchema('City'),
  email: z
    .string({
      required_error: 'E-mail is required.'
    })
    .email({ message: 'Invalid e-mail.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  name: commonStringSchema('Name', 2),
  notes: z.string().trim().optional(),
  phone: z.string().length(17, { message: 'Phone number is incomplete' }),
  state: commonStringSchema('State', 2),
  zipCode: z
    .string()
    .min(5, { message: 'Zip code must be at least 5 characters long' })
    .regex(/^\d{5}(?:[-\s]?\d{4})?$/, 'Invalid zip code')
    .min(5, { message: 'Zip code must be at least 5 characters long' }),
  language: z.enum(['English', 'Portuguese', 'Spanish'], {
    required_error: 'Language is required.',
    invalid_type_error: "Language must be 'English', 'Portuguese' or 'Spanish'."
  }),
  monthlyPayment: z.number().nullable(),
  clientType: z.enum(['Residential', 'Commercial'], {
    required_error: 'Client type is required.',
    invalid_type_error: "Client type must be 'Residential' or 'Company'."
  }),
  weekday: z.enum(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], {
    required_error: 'Weekday is required.',
    invalid_type_error: 'Weekday must be a string.'
  }),
  csvFile: z
    .instanceof(File)
    .refine((file) => file.size < 7000000, {
      message: 'Your file must be less than 7MB.'
    })
    .refine((file) => ['text/csv'].includes(file?.type), 'Only .csv formats are supported.')
    .optional(),
  imageFile: z.array(
    z
      .instanceof(File)
      .refine((file) => file.size < 7000000, {
        message: 'Your file must be less than 7MB.'
      })
      .refine((file) => ['image/jpeg', 'image/png'].includes(file?.type), 'Only .jpeg and .png formats are supported.')
  ),
  poolType: z.enum(['Salt', 'Chlorine', 'Other'], {
    required_error: 'Pool type is required.',
    invalid_type_error: "Pool type must be 'Salt', 'Chlorine' or 'Other'."
  }),
  date: z.coerce.date()
};

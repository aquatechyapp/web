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
  address: commonStringSchema('Address'),
  city: commonStringSchema('City'),
  email: z
    .string({
      required_error: 'E-mail is required.'
    })
    .email({ message: 'Invalid e-mail.' }),
  name: commonStringSchema('Name', 2),
  notes: z.string().trim().optional(),
  phone: z.string().min(1, { message: 'Phone is missing some caracteres' }),
  state: commonStringSchema('State', 2),
  zip: z
    .string({
      required_error: 'Zip is required.',
      invalid_type_error: 'Zip must be a string.'
    })
    .trim()
    .min(5, { message: 'Zip must be between 5 and 10 (with hifen) digits.' }),
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
  })
};

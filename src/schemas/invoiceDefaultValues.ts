import * as z from 'zod';

import { defaultSchemas } from './defaultSchemas';

const { notes } = defaultSchemas;

export const invoiceDefaultValuesSchema = z.object({
  paymentInstructions: z
    .string({
      invalid_type_error: 'Payment instructions must be a string.'
    })
    .trim()
    .nullable()
    .optional(),
  notes: notes.nullable().optional(),
  defaultFrequency: z
    .enum(
      ['Weekly', 'Monthly', 'Each2Months', 'Each3Months', 'Each4Months', 'Each6Months', 'Yearly'],
      {
        invalid_type_error:
          "Default frequency must be 'Weekly', 'Monthly', 'Each2Months', 'Each3Months', 'Each4Months', 'Each6Months' or 'Yearly'."
      }
    )
    .nullable()
    .optional(),
  defaultPaymentTerm: z
    .enum(['OneDay', 'ThreeDays', 'SevenDays', 'FifteenDays', 'ThirtyDays', 'SixtyDays'], {
      invalid_type_error:
        "Default payment term must be 'OneDay', 'ThreeDays', 'SevenDays', 'FifteenDays', 'ThirtyDays' or 'SixtyDays'."
    })
    .nullable()
    .optional()
});

export const editInvoiceDefaultValuesSchema = z.object({
  paymentInstructions: z
    .string({
      invalid_type_error: 'Payment instructions must be a string.'
    })
    .trim()
    .nullable()
    .optional(),
  notes: notes.nullable().optional(),
  defaultFrequency: z
    .enum(
      ['Weekly', 'Monthly', 'Each2Months', 'Each3Months', 'Each4Months', 'Each6Months', 'Yearly'],
      {
        invalid_type_error:
          "Default frequency must be 'Weekly', 'Monthly', 'Each2Months', 'Each3Months', 'Each4Months', 'Each6Months' or 'Yearly'."
      }
    )
    .nullable()
    .optional(),
  defaultPaymentTerm: z
    .enum(['OneDay', 'ThreeDays', 'SevenDays', 'FifteenDays', 'ThirtyDays', 'SixtyDays'], {
      invalid_type_error:
        "Default payment term must be 'OneDay', 'ThreeDays', 'SevenDays', 'FifteenDays', 'ThirtyDays' or 'SixtyDays'."
    })
    .nullable()
    .optional()
});

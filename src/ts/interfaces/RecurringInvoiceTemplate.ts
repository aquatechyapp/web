/**
 * Recurring Invoice Frequency Enum
 */
export enum RecurringInvoiceFrequency {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Each2Months = 'Each2Months',
  Each3Months = 'Each3Months',
  Each4Months = 'Each4Months',
  Each6Months = 'Each6Months',
  Yearly = 'Yearly'
}

/**
 * Recurring Invoice Delivery Enum
 */
export enum RecurringInvoiceDelivery {
  SaveAsDraft = 'SaveAsDraft',
  SendOnCreation = 'SendOnCreation'
}

/**
 * Payment Terms Days Enum
 */
export enum PaymentTermsDays {
  OneDay = 'OneDay',
  ThreeDays = 'ThreeDays',
  SevenDays = 'SevenDays',
  FifteenDays = 'FifteenDays',
  ThirtyDays = 'ThirtyDays',
  SixtyDays = 'SixtyDays'
}

/**
 * Recurring Invoice Template Line Item Input (for creating/updating templates)
 */
export interface RecurringInvoiceTemplateLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Recurring Invoice Template Line Item (from API response)
 */
export interface RecurringInvoiceTemplateLineItem {
  id: string;
  templateId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client information included in template response
 */
export interface RecurringInvoiceTemplateClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Company Owner information included in template response
 */
export interface RecurringInvoiceTemplateCompanyOwner {
  id: string;
  name: string;
  email: string;
}

/**
 * Invoice information included in template response (optional)
 */
export interface RecurringInvoiceTemplateInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  issuedDate: string;
  dueDate: string;
}

/**
 * Recurring Invoice Template entity
 */
export interface RecurringInvoiceTemplate {
  id: string;
  referenceNumber: string;
  clientId: string;
  companyOwnerId: string;
  startOn: string;
  frequency: RecurringInvoiceFrequency;
  delivery: RecurringInvoiceDelivery;
  isActive: boolean;
  lastCreatedAt: string | null;
  nextScheduledDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  paymentTerms: PaymentTermsDays;
  notes: string | null;
  paymentInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  client: RecurringInvoiceTemplateClient;
  companyOwner: RecurringInvoiceTemplateCompanyOwner;
  lineItems: RecurringInvoiceTemplateLineItem[];
  invoices?: RecurringInvoiceTemplateInvoice[];
}

/**
 * Create Recurring Invoice Template Request
 */
export interface CreateRecurringInvoiceTemplateRequest {
  clientId: string;
  startOn: string; // ISO 8601 date string
  frequency: RecurringInvoiceFrequency;
  delivery: RecurringInvoiceDelivery;
  lineItems: RecurringInvoiceTemplateLineItemInput[];
  subtotal: number;
  taxRate?: number;
  discountRate?: number;
  paymentTerms: PaymentTermsDays;
  notes?: string;
  paymentInstructions?: string;
}

/**
 * Create Recurring Invoice Template Response
 */
export interface CreateRecurringInvoiceTemplateResponse {
  template: RecurringInvoiceTemplate;
}

/**
 * List Recurring Invoice Templates Query Parameters
 */
export interface ListRecurringInvoiceTemplatesParams {
  clientId?: string;
  isActive?: boolean;
}

/**
 * List Recurring Invoice Templates Response
 */
export interface ListRecurringInvoiceTemplatesResponse {
  templates: RecurringInvoiceTemplate[];
}

/**
 * Get Recurring Invoice Template by ID Response
 */
export interface GetRecurringInvoiceTemplateByIdResponse {
  template: RecurringInvoiceTemplate;
}

/**
 * Update Recurring Invoice Template Request
 */
export interface UpdateRecurringInvoiceTemplateRequest {
  templateId: string;
  startOn?: string; // ISO 8601 date string
  frequency?: RecurringInvoiceFrequency;
  delivery?: RecurringInvoiceDelivery;
  lineItems?: RecurringInvoiceTemplateLineItemInput[];
  subtotal?: number;
  taxRate?: number;
  discountRate?: number;
  paymentTerms?: PaymentTermsDays;
  notes?: string;
  paymentInstructions?: string;
  isActive?: boolean;
}

/**
 * Update Recurring Invoice Template Response
 */
export interface UpdateRecurringInvoiceTemplateResponse {
  template: RecurringInvoiceTemplate;
}

/**
 * Delete Recurring Invoice Template Request
 */
export interface DeleteRecurringInvoiceTemplateRequest {
  templateId: string;
}

/**
 * Delete Recurring Invoice Template Response
 */
export interface DeleteRecurringInvoiceTemplateResponse {
  message: string;
}





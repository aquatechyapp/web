/**
 * Invoice Status Types
 */
export type InvoiceStatus = 'draft' | 'unpaid' | 'paid' | 'overdue' | 'cancelled';

/**
 * Invoice Line Item Input (for creating invoices)
 */
export interface InvoiceLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

/**
 * Invoice Line Item (from API response)
 * Each item has its own taxAmount; invoice taxAmount = sum of item taxAmounts
 */
export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Client information included in invoice response
 */
export interface InvoiceClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

/**
 * Company Owner information included in invoice response
 */
export interface InvoiceCompanyOwner {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Invoice entity
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  companyOwnerId: string;
  issuedDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  paymentTerms: string | null;
  notes: string | null;
  paymentInstructions: string | null;
  createdAt: string;
  updatedAt: string | null;
  client: InvoiceClient;
  companyOwner: InvoiceCompanyOwner;
  lineItems: InvoiceLineItem[];
}

/**
 * Create Invoice as Draft Request
 */
export interface CreateInvoiceAsDraftRequest {
  clientId: string;
  issuedDate: string;
  dueDate: string;
  lineItems: InvoiceLineItemInput[];
  subtotal: number;
  discountRate?: number;
  paymentTerms?: string;
  notes?: string;
  paymentInstructions?: string;
}

/**
 * Create Invoice as Draft Response
 */
export interface CreateInvoiceAsDraftResponse {
  invoice: Invoice;
}

/**
 * Create Invoice and Send Email Request
 * Note: Request structure is identical to CreateInvoiceAsDraftRequest
 */
export type CreateInvoiceAndSendEmailRequest = CreateInvoiceAsDraftRequest;

/**
 * Create Invoice and Send Email Response
 * Note: Response structure is identical to CreateInvoiceAsDraftResponse
 * The invoice status will be "unpaid" instead of "draft"
 */
export type CreateInvoiceAndSendEmailResponse = CreateInvoiceAsDraftResponse;

/**
 * Send Invoice Email Request
 */
export interface SendInvoiceRequest {
  invoiceId: string;
}

/**
 * Send Invoice Email Response
 */
export interface SendInvoiceResponse {
  message: string;
  invoiceId: string;
}

/**
 * Send Invoice Reminder Request
 */
export interface SendInvoiceReminderRequest {
  invoiceId: string;
}

/**
 * Send Invoice Reminder Response
 */
export interface SendInvoiceReminderResponse {
  message: string;
  invoiceId: string;
}

/**
 * Update Invoice Request
 */
export interface UpdateInvoiceRequest {
  invoiceId: string;
  clientId?: string;
  issuedDate?: string;
  dueDate?: string;
  lineItems?: InvoiceLineItemInput[];
  subtotal?: number;
  discountRate?: number;
  paymentTerms?: string;
  notes?: string;
  paymentInstructions?: string;
  status?: InvoiceStatus;
}

/**
 * Update Invoice Response
 */
export interface UpdateInvoiceResponse {
  invoice: Invoice;
}

/**
 * Update Invoice Status Request
 */
export interface UpdateInvoiceStatusRequest {
  invoiceId: string;
  status: InvoiceStatus;
}

/**
 * Update Invoice Status Response
 */
export interface UpdateInvoiceStatusResponse {
  invoice: Invoice;
}

/**
 * Delete Invoice Request
 */
export interface DeleteInvoiceRequest {
  invoiceId: string;
}

/**
 * Delete Invoice Response
 * Note: The API returns an empty response body (204 No Content) on success
 */
export interface DeleteInvoiceResponse {
  message?: string;
}


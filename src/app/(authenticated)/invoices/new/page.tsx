'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Trash2, Repeat } from 'lucide-react';
import { differenceInDays, isSameDay } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import SelectField from '@/components/SelectField';
import InputField from '@/components/InputField';
import DatePickerField from '@/components/DatePickerField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InvoicePreview } from './InvoicePreview';
import { DetailedInvoice } from '../utils/fakeData';
import { FieldType } from '@/ts/enums/enums';
import { useCreateInvoiceAsDraft } from '@/hooks/react-query/invoices/useCreateInvoiceAsDraft';
import { useCreateInvoiceAndSendEmail } from '@/hooks/react-query/invoices/useCreateInvoiceAndSendEmail';
import { CreateInvoiceAsDraftRequest, InvoiceLineItemInput } from '@/ts/interfaces/Invoice';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceFormData {
  clientId: string;
  invoiceNumber: string;
  issuedDate: Date;
  dueDate: Date;
  lineItems: InvoiceLineItem[];
  taxRate: number;
  paymentTerms: string;
  notes: string;
  paymentInstructions: string;
}

const defaultPaymentTerms = 'Net 30 - Payment due within 30 days';
const defaultPaymentInstructions = 'Please make payment via check or bank transfer. Contact us for bank details.';

export default function CreateInvoicePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: clients = [], isLoading: isLoadingClients } = useGetAllClients();
  const { mutate: createDraft, isPending: isCreatingDraft } = useCreateInvoiceAsDraft();
  const { mutate: createAndSend, isPending: isCreatingAndSending } = useCreateInvoiceAndSendEmail();

  const form = useForm<InvoiceFormData>({
    defaultValues: {
      clientId: '',
      invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
      issuedDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lineItems: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ],
      taxRate: 0,
      paymentTerms: defaultPaymentTerms,
      notes: '',
      paymentInstructions: defaultPaymentInstructions
    }
  });

  const watchedClientId = form.watch('clientId');
  const watchedLineItems = form.watch('lineItems');
  const watchedTaxRate = form.watch('taxRate');
  const watchedIssuedDate = form.watch('issuedDate');
  const watchedDueDate = form.watch('dueDate');
  const watchedPaymentTerms = form.watch('paymentTerms');
  const watchedNotes = form.watch('notes');
  const watchedPaymentInstructions = form.watch('paymentInstructions');
  const watchedInvoiceNumber = form.watch('invoiceNumber');

  // Auth check
  useEffect(() => {
    if (user.firstName === '') {
      router.push('/onboarding');
    }
  }, [user, router]);

  // Auto-update payment terms based on date difference
  useEffect(() => {
    if (!watchedIssuedDate || !watchedDueDate) return;

    const issuedDate = new Date(watchedIssuedDate);
    const dueDate = new Date(watchedDueDate);

    // Check if dates are the same day
    if (isSameDay(issuedDate, dueDate)) {
      form.setValue('paymentTerms', 'Due on Receipt - Payment due immediately', { shouldDirty: false });
      return;
    }

    // Calculate days difference
    const daysDiff = differenceInDays(dueDate, issuedDate);

    if (daysDiff <= 0) {
      // If due date is before or same as issued date, use "Due on Receipt"
      form.setValue('paymentTerms', 'Due on Receipt - Payment due immediately', { shouldDirty: false });
    } else {
      // Format payment terms based on days difference
      form.setValue('paymentTerms', `Net ${daysDiff} - Payment due within ${daysDiff} days`, { shouldDirty: false });
    }
  }, [watchedIssuedDate, watchedDueDate, form]);

  // Calculate amounts for line items in real-time
  useEffect(() => {
    const currentItems = form.getValues('lineItems');
    const updatedItems = currentItems.map((item) => {
      // Ensure quantity and unitPrice are numbers
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const calculatedAmount = Math.round(quantity * unitPrice * 100) / 100;
      
      // Always update to ensure amounts are recalculated
      return { ...item, amount: calculatedAmount, quantity, unitPrice };
    });
    
    // Check if any values actually changed
    const hasChanges = updatedItems.some((item, index) => {
      const currentItem = currentItems[index];
      if (!currentItem) return true;
      const currentAmount = Number(currentItem?.amount) || 0;
      const currentQuantity = Number(currentItem?.quantity) || 0;
      const currentUnitPrice = Number(currentItem?.unitPrice) || 0;
      return (
        item.amount !== currentAmount ||
        item.quantity !== currentQuantity ||
        item.unitPrice !== currentUnitPrice
      );
    });
    
    if (hasChanges) {
      form.setValue('lineItems', updatedItems, { shouldDirty: false, shouldValidate: false });
    }
  }, [watchedLineItems, form]);

  // Build client options
  const clientOptions = useMemo(() => {
    return clients
      .filter((client) => client.isActive)
      .map((client) => ({
        key: client.id,
        value: client.id,
        name: client.fullName || `${client.firstName} ${client.lastName}`
      }));
  }, [clients]);

  // Get selected client
  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === watchedClientId);
  }, [clients, watchedClientId]);

  // Calculate invoice totals
  const invoiceTotals = useMemo(() => {
    const subtotal = watchedLineItems.reduce((sum, item) => {
      const amount = Number(item.amount) || 0;
      return sum + amount;
    }, 0);
    const taxRate = Number(watchedTaxRate) || 0;
    const taxAmount = Math.round((subtotal * taxRate) / 100 * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;
    return { subtotal, taxAmount, total };
  }, [watchedLineItems, watchedTaxRate]);

  // Build preview invoice data
  const previewInvoice: DetailedInvoice | null = useMemo(() => {
    if (!selectedClient) return null;

    const clientAddress = [
      selectedClient.address,
      `${selectedClient.city}, ${selectedClient.state} ${selectedClient.zip}`.trim()
    ]
      .filter(Boolean)
      .join('\n');

    return {
      id: 'preview',
      invoiceNumber: watchedInvoiceNumber || '',
      clientId: watchedClientId || '',
      clientName: selectedClient.fullName || `${selectedClient.firstName} ${selectedClient.lastName}`,
      issuedDate: watchedIssuedDate || new Date(),
      dueDate: watchedDueDate || new Date(),
      amount: invoiceTotals.total,
      status: 'draft' as const,
      lineItems: watchedLineItems
        .filter((item) => {
          // Show item if it has description, quantity, or unitPrice filled
          const hasDescription = item.description.trim() !== '';
          const hasQuantity = Number(item.quantity) > 0;
          const hasUnitPrice = Number(item.unitPrice) > 0;
          return hasDescription || hasQuantity || hasUnitPrice;
        })
        .map((item) => ({
          description: item.description || '',
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          amount: Number(item.amount) || 0
        })),
      subtotal: invoiceTotals.subtotal,
      taxRate: Number(watchedTaxRate) || 0,
      taxAmount: invoiceTotals.taxAmount,
      total: invoiceTotals.total,
      paymentTerms: watchedPaymentTerms || '',
      notes: watchedNotes || '',
      paymentInstructions: watchedPaymentInstructions || '',
      clientAddress
    };
  }, [
    selectedClient,
    invoiceTotals,
    watchedInvoiceNumber,
    watchedClientId,
    watchedIssuedDate,
    watchedDueDate,
    watchedLineItems,
    watchedTaxRate,
    watchedPaymentTerms,
    watchedNotes,
    watchedPaymentInstructions
  ]);

  const handleAddLineItem = () => {
    const currentItems = form.getValues('lineItems');
    form.setValue('lineItems', [
      ...currentItems,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    const currentItems = form.getValues('lineItems');
    if (currentItems.length > 1) {
      form.setValue(
        'lineItems',
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const handleLineItemChange = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    // This function is called by the custom onChange handlers
    // The useEffect will handle recalculating amounts, so we just need to update the value
    // Get the latest values from the form
    const currentItems = form.getValues('lineItems');
    const updatedItems = [...currentItems];
    // Ensure numeric fields are stored as numbers
    const numValue = (field === 'quantity' || field === 'unitPrice' || field === 'amount') 
      ? Number(value) || 0 
      : value;
    
    // Update the field value
    updatedItems[index] = { ...updatedItems[index], [field]: numValue };
    
    // Recalculate amount immediately for quantity and unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? (Number(value) || 0) : Number(updatedItems[index].quantity) || 0;
      const unitPrice = field === 'unitPrice' ? (Number(value) || 0) : Number(updatedItems[index].unitPrice) || 0;
      updatedItems[index].amount = Math.round(quantity * unitPrice * 100) / 100;
    }
    
    form.setValue('lineItems', updatedItems, { shouldDirty: false });
  };

  // Helper function to validate and prepare invoice data
  const prepareInvoiceData = (): CreateInvoiceAsDraftRequest | null => {
    const formData = form.getValues();
    
    // Validate required fields
    if (!formData.clientId) {
      form.setError('clientId', { message: 'Client is required' });
      return null;
    }

    if (!formData.issuedDate) {
      form.setError('issuedDate', { message: 'Issued date is required' });
      return null;
    }

    if (!formData.dueDate) {
      form.setError('dueDate', { message: 'Due date is required' });
      return null;
    }

    // Filter and validate line items - must have at least one valid item
    const validLineItems: InvoiceLineItemInput[] = formData.lineItems
      .filter((item) => {
        const hasDescription = item.description.trim() !== '';
        const hasQuantity = Number(item.quantity) > 0;
        const hasUnitPrice = Number(item.unitPrice) > 0;
        return hasDescription && hasQuantity && hasUnitPrice;
      })
      .map((item) => ({
        description: item.description.trim(),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }));

    if (validLineItems.length === 0) {
      form.setError('lineItems', { message: 'At least one valid line item is required' });
      return null;
    }

    // Calculate subtotal from valid line items
    const subtotal = validLineItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    // Prepare dates - set to start/end of day for proper ISO conversion
    const issuedDate = new Date(formData.issuedDate);
    issuedDate.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(formData.dueDate);
    dueDate.setHours(23, 59, 59, 999);

    // Build request payload - ensure all numeric fields are numbers
    const taxRate = Number(formData.taxRate) || 0;
    const discountRate = 0; // Not in form, defaulting to 0

    const requestData: CreateInvoiceAsDraftRequest = {
      clientId: formData.clientId,
      issuedDate: issuedDate.toISOString(),
      dueDate: dueDate.toISOString(),
      lineItems: validLineItems,
      subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      taxRate: taxRate,
      discountRate: discountRate,
      paymentTerms: formData.paymentTerms || undefined,
      notes: formData.notes || undefined,
      paymentInstructions: formData.paymentInstructions || undefined
    };

    return requestData;
  };

  const handleSaveDraft = () => {
    const invoiceData = prepareInvoiceData();
    if (!invoiceData) return;

    createDraft(invoiceData, {
      onSuccess: () => {
        router.push('/invoices');
      }
    });
  };

  const handleCreateInvoice = () => {
    const invoiceData = prepareInvoiceData();
    if (!invoiceData) return;

    createAndSend(invoiceData, {
      onSuccess: () => {
        router.push('/invoices');
      }
    });
  };

  const handleSwitchToRecurring = () => {
    router.push('/invoices/recurring');
  };

  if (isLoadingClients) {
    return <LoadingSpinner />;
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6 p-2">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Create Invoice</h1>
          </div>
          <Button variant="outline" onClick={handleSwitchToRecurring}>
            <Repeat className="mr-2 h-4 w-4" />
            Create Recurring Template
          </Button>
        </div>

        {/* Main Content: Form and Preview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Invoice Details</h2>
              <div className="space-y-4">
                <SelectField
                  name="clientId"
                  label="Client"
                  placeholder="Select client"
                  options={clientOptions}
                />

                <InputField
                  name="invoiceNumber"
                  label="Invoice Number"
                  placeholder="Invoice number"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DatePickerField
                    name="issuedDate"
                    label="Issued Date"
                    placeholder="Select issued date"
                  />
                  <DatePickerField
                    name="dueDate"
                    label="Due Date"
                    placeholder="Select due date"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Line Items</h2>
                <Button type="button" variant="outline" size="sm" onClick={handleAddLineItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-4">
                {watchedLineItems.map((item, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                      {watchedLineItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLineItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <InputField
                        name={`lineItems.${index}.description`}
                        label="Description"
                        placeholder="Item description"
                        type={FieldType.TextArea}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          name={`lineItems.${index}.quantity`}
                          label="Quantity"
                          placeholder="1"
                          type={FieldType.Number}
                          props={{
                            min: 0,
                            step: 1,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                              handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                          }}
                        />
                        <InputField
                          name={`lineItems.${index}.unitPrice`}
                          label="Unit Price"
                          placeholder="0.00"
                          type={FieldType.Number}
                          props={{
                            min: 0,
                            step: 0.01,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                              handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                          }}
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Amount: </span>
                        <span className="font-semibold">${(Number(item.amount) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax and Totals */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Tax & Totals</h2>
              <div className="space-y-4">
                <InputField
                  name="taxRate"
                  label="Tax Rate (%)"
                  placeholder="0.00"
                  type={FieldType.Number}
                  props={{
                    min: 0,
                    max: 100,
                    step: 0.01
                  }}
                />
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${invoiceTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({watchedTaxRate}%):</span>
                    <span className="font-semibold">${invoiceTotals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold">
                    <span>Total:</span>
                    <span>${invoiceTotals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Terms and Notes */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Additional Information</h2>
              <div className="space-y-4">
                <InputField
                  name="paymentTerms"
                  label="Payment Terms"
                  placeholder="Payment terms"
                  type={FieldType.TextArea}
                />
                <InputField
                  name="notes"
                  label="Notes"
                  placeholder="Additional notes (optional)"
                  type={FieldType.TextArea}
                />
                <InputField
                  name="paymentInstructions"
                  label="Payment Instructions"
                  placeholder="Payment instructions"
                  type={FieldType.TextArea}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft} 
                className="flex-1"
                disabled={isCreatingDraft || isCreatingAndSending}
              >
                {isCreatingDraft ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button 
                onClick={handleCreateInvoice} 
                className="flex-1"
                disabled={isCreatingDraft || isCreatingAndSending}
              >
                {isCreatingAndSending ? 'Creating & Sending...' : 'Create Invoice'}
              </Button>
            </div>
          </div>

          {/* Right: Preview (Desktop) / Below (Mobile) */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            {previewInvoice ? (
              <InvoicePreview invoice={previewInvoice} />
            ) : (
              <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
                <p className="text-gray-500">Select a client to preview the invoice</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}


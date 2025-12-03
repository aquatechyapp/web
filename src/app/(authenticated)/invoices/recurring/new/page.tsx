'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import useGetPoolsByClientId from '@/hooks/react-query/pools/getPoolsByClientId';
import SelectField from '@/components/SelectField';
import InputField from '@/components/InputField';
import DatePickerField from '@/components/DatePickerField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FieldType } from '@/ts/enums/enums';
import { useCreateRecurringInvoiceTemplate } from '@/hooks/react-query/invoices/useCreateRecurringInvoiceTemplate';
import { useToast } from '@/components/ui/use-toast';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface RecurringInvoiceFormData {
  clientId: string;
  poolId?: string;
  startDate: Date;
  frequency: 'weekly' | 'monthly' | 'yearly';
  delivery: 'draft' | 'auto-send';
  referenceNumber?: string;
  paymentTerms: string; // Will be a number of days: 1, 3, 7, 15, 30, or 60
  discount: number; // Percentage
  lineItems: InvoiceLineItem[];
  taxRate: number;
  notes: string;
  paymentInstructions: string;
}

const paymentTermsOptions = [
  { key: '1', value: '1', name: 'Due on 1 day' },
  { key: '3', value: '3', name: 'Due on 3 days' },
  { key: '7', value: '7', name: 'Due on 7 days' },
  { key: '15', value: '15', name: 'Due on 15 days' },
  { key: '30', value: '30', name: 'Due on 30 days' },
  { key: '60', value: '60', name: 'Due on 60 days' }
];

const frequencyOptions = [
  { key: 'weekly', value: 'weekly', name: 'Weekly' },
  { key: 'monthly', value: 'monthly', name: 'Monthly' },
  { key: 'yearly', value: 'yearly', name: 'Yearly' }
];

const deliveryOptions = [
  { key: 'draft', value: 'draft', name: 'Save invoices as draft' },
  { key: 'auto-send', value: 'auto-send', name: 'Automatically send on creation' }
];

const defaultPaymentInstructions = 'Please make payment via check or bank transfer. Contact us for bank details.';

export default function CreateRecurringInvoicePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: clients = [], isLoading: isLoadingClients } = useGetAllClients();
  const { mutate: createTemplate, isPending: isCreating } = useCreateRecurringInvoiceTemplate();
  const { toast } = useToast();

  const form = useForm<RecurringInvoiceFormData>({
    defaultValues: {
      clientId: '',
      poolId: undefined,
      startDate: new Date(),
      frequency: 'monthly',
      delivery: 'draft',
      referenceNumber: '',
      paymentTerms: '30',
      discount: 0,
      lineItems: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ],
      taxRate: 0,
      notes: '',
      paymentInstructions: defaultPaymentInstructions
    }
  });

  const watchedClientId = form.watch('clientId');
  const watchedLineItems = form.watch('lineItems');
  const watchedTaxRate = form.watch('taxRate');
  const watchedDiscount = form.watch('discount');

  const { data: pools = [], isLoading: isLoadingPools } = useGetPoolsByClientId(
    watchedClientId || null
  );

  // Auth check
  useEffect(() => {
    if (user.firstName === '') {
      router.push('/onboarding');
    }
  }, [user, router]);

  // Calculate amounts for line items in real-time
  useEffect(() => {
    const currentItems = form.getValues('lineItems');
    const updatedItems = currentItems.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const calculatedAmount = Math.round(quantity * unitPrice * 100) / 100;
      
      return { ...item, amount: calculatedAmount, quantity, unitPrice };
    });
    
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

  // Build pool options
  const poolOptions = useMemo(() => {
    return pools
      .filter((pool) => pool.isActive)
      .map((pool) => ({
        key: pool.id,
        value: pool.id,
        name: pool.name
      }));
  }, [pools]);

  // Calculate invoice totals
  const invoiceTotals = useMemo(() => {
    const subtotal = watchedLineItems.reduce((sum, item) => {
      const amount = Number(item.amount) || 0;
      return sum + amount;
    }, 0);
    
    // Apply discount
    const discountRate = Number(watchedDiscount) || 0;
    const discountAmount = Math.round((subtotal * discountRate) / 100 * 100) / 100;
    const subtotalAfterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
    
    // Apply tax
    const taxRate = Number(watchedTaxRate) || 0;
    const taxAmount = Math.round((subtotalAfterDiscount * taxRate) / 100 * 100) / 100;
    const total = Math.round((subtotalAfterDiscount + taxAmount) * 100) / 100;
    
    return { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total };
  }, [watchedLineItems, watchedTaxRate, watchedDiscount]);

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
    const currentItems = form.getValues('lineItems');
    const updatedItems = [...currentItems];
    const numValue = (field === 'quantity' || field === 'unitPrice' || field === 'amount') 
      ? Number(value) || 0 
      : value;
    
    updatedItems[index] = { ...updatedItems[index], [field]: numValue };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? (Number(value) || 0) : Number(updatedItems[index].quantity) || 0;
      const unitPrice = field === 'unitPrice' ? (Number(value) || 0) : Number(updatedItems[index].unitPrice) || 0;
      updatedItems[index].amount = Math.round(quantity * unitPrice * 100) / 100;
    }
    
    form.setValue('lineItems', updatedItems, { shouldDirty: false });
  };

  const handleSubmit = (data: RecurringInvoiceFormData) => {
    // Filter out empty line items
    const validLineItems = data.lineItems.filter((item) => {
      const hasDescription = item.description.trim() !== '';
      const hasQuantity = Number(item.quantity) > 0;
      const hasUnitPrice = Number(item.unitPrice) > 0;
      return hasDescription && hasQuantity && hasUnitPrice;
    });

    if (validLineItems.length === 0) {
      toast({
        duration: 3000,
        variant: 'error',
        title: 'Validation Error',
        description: 'Please add at least one line item with description, quantity, and unit price.'
      });
      return;
    }

    const templateData = {
      ...data,
      lineItems: validLineItems,
      paymentTerms: parseInt(data.paymentTerms, 10) // Convert to number
    };

    createTemplate(templateData, {
      onSuccess: () => {
        router.push('/invoices/recurring');
      }
    });
  };

  if (isLoadingClients) {
    return <LoadingSpinner />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-6 p-2">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Create Recurring Invoice Template</h1>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6">
            {/* Basic Information */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Template Details</h2>
              <div className="space-y-4">
                <SelectField
                  name="clientId"
                  label="Client"
                  placeholder="Select client"
                  options={clientOptions}
                />

                {watchedClientId && (
                  <SelectField
                    name="poolId"
                    label="Pool (Optional)"
                    placeholder={isLoadingPools ? 'Loading pools...' : 'Select pool (optional)'}
                    options={poolOptions}
                  />
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DatePickerField
                    name="startDate"
                    label="Start On"
                    placeholder="Select start date"
                    
                  />

                  <SelectField
                    name="frequency"
                    label="Frequency"
                    placeholder="Select frequency"
                    options={frequencyOptions}
                  />
                </div>

                <SelectField
                  name="delivery"
                  label="Delivery"
                  placeholder="Select delivery option"
                  options={deliveryOptions}
                />

                <InputField
                  name="referenceNumber"
                  label="Reference Number (Optional)"
                  placeholder="Enter reference number"
                />

                <SelectField
                  name="paymentTerms"
                  label="Payment Terms"
                  placeholder="Select payment terms"
                  options={paymentTermsOptions}
                />

                <InputField
                  name="discount"
                  label="Discount (%)"
                  placeholder="0.00"
                  type={FieldType.Number}
                  props={{
                    min: 0,
                    max: 100,
                    step: 0.01
                  }}
                />
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
                  {invoiceTotals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount ({watchedDiscount}%):</span>
                      <span className="font-semibold text-red-600">-${invoiceTotals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoiceTotals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal after discount:</span>
                      <span className="font-semibold">${invoiceTotals.subtotalAfterDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoiceTotals.taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({watchedTaxRate}%):</span>
                      <span className="font-semibold">${invoiceTotals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
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
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Template'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}


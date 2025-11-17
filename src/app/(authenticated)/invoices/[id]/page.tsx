'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useInvoices, { InvoicePayload } from '@/hooks/react-query/invoices/useInvoices';
import { useParams, useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalDeleteInvoice } from '../DataTableInvoice/ModalDeleteInvoice';
import { Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const defaultValues = {
  fromCompany: '',
  fromEmail: '',
  fromAddress: '',
  toName: '',
  toEmail: '',
  toAddress: '',
  lineItems: [
    { description: '', quantity: '', amount: '' },
  ],
  type: 'OneTime' as 'OneTime' | 'Recurring',
  status: 'Draft' as 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled' | 'Void',
  currency: 'USD',
  notes: '',
  description: '',
  dueDate: new Date().toISOString().split("T")[0],
};

// Schema for invoice line items
const lineItemSchema = z.object({
  description: z
    .string({
      required_error: 'Item description is required',
    })
    .min(1, 'Item description is required'),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .positive('Quantity must be greater than zero'),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than zero'),
});

// Main invoice schema
export const invoiceSchema = z.object({
  fromCompany: z
    .string({
      required_error: 'Company name is required',
    })
    .min(1, 'Company name is required'),
  fromEmail: z
    .string()
    .email('Please enter a valid company email')
    .optional(),
  fromAddress: z.string().optional(),

  toName: z
    .string({
      required_error: 'Client name is required',
    })
    .min(1, 'Client name is required'),
  toEmail: z.string().email('Please enter a valid client email'),
  toAddress: z.string().optional(),

  lineItems: z
    .array(lineItemSchema)
    .min(1, 'Please add at least one line item'),

  type: z.enum(['OneTime', 'Recurring']).optional(),
  status: z
    .enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled', 'Void'])
    .optional(),

  currency: z.string().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormValues = typeof defaultValues;

export default function Page() {
  const { data: companies } = useGetCompanies();
  const { data: clients } = useGetAllClients();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [autoSend, setAutoSend] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(invoiceSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const watched = watch();
  const total = (watched.lineItems || []).reduce((acc, it) => {
    const q = Number(it.quantity) || 0;
    const a = Number(it.amount) || 0;
    return acc + q * a;
  }, 0);

  const singleId = Array.isArray(id) ? id[0] : id;
  const invoices = useInvoices(
    undefined,
    singleId && /^[0-9a-fA-F]{24}$/.test(singleId) ? singleId : undefined
  );

  const isSubmitting =
    invoices.createInvoice.isPending || invoices.updateInvoice.isPending;

  useEffect(() => {
    const inv = invoices.invoiceById.data;
    if (id && inv) {
      reset({
        fromCompany: inv.company?.name || "",
        fromEmail: inv.company?.email || "",
        fromAddress: inv.company?.address || "",
        toName: `${inv.client?.firstName || ""} ${inv.client?.lastName || ""}`.trim(),
        dueDate: inv.dueDate?.split("T")[0] || '',
        toEmail: inv.client?.email || "",
        toAddress: inv.client?.address || "",
        lineItems:
          inv.items?.map((item: any) => ({
            description: item.name,
            quantity: item.units,
            amount: item.pricePerUnit,
          })) || [{ description: "", quantity: 0, amount: 0 }],
        // status: inv.status || "Draft",
        currency: inv.currency || "USD",
        notes: inv.notes || "",
        description: inv.description || "",
      });
    }
  }, [id, invoices.invoiceById.data]);

  useEffect(() => {
    const inv = invoices.invoiceById.data;
    if (id && inv) {
      setSelectedClient(inv.clientId || '');
      setSelectedCompany(inv.companyId || '');
      setValue("status", inv.status || '');
    }
  }, [selectedCompany, invoices.invoiceById.data]);

  const onSubmit = (data: FormValues) => {
    const isValidId = singleId && /^[0-9a-fA-F]{24}$/.test(singleId);

    const payload: InvoicePayload = {
      clientId: selectedClient,
      companyId: selectedCompany,
      amount: total,
      issueDate: new Date().toISOString(),
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: data.type,
      status: data.status || undefined,
      currency: data.currency || 'USD',
      notes: data.notes || undefined,
      description: data.description || undefined,
      ...(autoSend ? { autoSendEmail: true } : {}),
      items: data.lineItems.map((item) => ({
        name: item.description,
        pricePerUnit: Number(item.amount),
        units: Number(item.quantity),
      })),
    };

    if (isValidId) {
      const { clientId, companyId, ...updatePayload } = payload;
      invoices.updateInvoice.mutate(
        { invoiceId: id as string, payload: updatePayload },
        {
          onSuccess: () => {
            toast({ title: 'Invoice updated successfully', variant: 'success' }),
              router.back();
          },
          onError: (err) =>
            toast({
              title: 'Error updating invoice',
              description: err.message,
              variant: 'destructive',
            }),
        }
      );
    } else {
      invoices.createInvoice.mutate(payload, {
        onSuccess: (invoice) => {
          toast({
            title: 'Invoice created successfully!',
            description:
              'Your new invoice has been created and is ready to be sent to the client.',
            variant: 'success',
          }),
            router.back();
      },
        onError: (err) =>
          toast({
            title: 'Error creating invoice',
            description: err.message,
            variant: 'destructive',
          }),
      });
    }
  };

  const addItem = () => append({ description: '', quantity: '', amount: '' });

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  if (id !== 'create' && !invoices.isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      {/* @ts-ignore */}
      <Form control={control as any}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-6 items-center">

          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete invoice"
                type='button'
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* From Company */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">From (Company)</label>
                <Select
                  disabled={watch('status') === 'Sent'}
                  value={selectedCompany}
                  onValueChange={(value) => {
                    setSelectedCompany(value);
                    const company = companies.find((c) => c.id === value);
                    if (company) {
                      setValue('fromCompany', company.name, { shouldValidate: true });
                      setValue('fromEmail', company.email || '', { shouldValidate: true });
                      setValue('fromAddress', company.address || '', { shouldValidate: true });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fromCompany && <span className="text-red-500 text-xs mt-1">{errors.fromCompany.message}</span>}
              </div>

              {/* From Email */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">From Email</label>
                <Input
                  disabled={watch('status') === 'Sent'}
                 {...register('fromEmail')} placeholder="Email address" />
                {errors.fromEmail && <span className="text-red-500 text-xs mt-1">{errors.fromEmail.message}</span>}
              </div>

              {/* To Client */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">To (Client)</label>
                <Select
                  disabled={!selectedCompany || watch('status') === 'Sent'}
                  value={selectedClient}
                  onValueChange={(value) => {
                    setSelectedClient(value);
                    const client = clients?.find((c) => c.id === value);
                    if (client) {
                      setValue('toName', `${client.firstName} ${client.lastName}`, { shouldValidate: true }); // 👈
                      setValue('toEmail', client.email || '', { shouldValidate: true });
                      setValue(
                        'toAddress',
                        `${client.address || ''}, ${client.city || ''}, ${client.state || ''} ${client.zip || ''}`,
                        { shouldValidate: true }
                      );
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients
                      ?.filter((client) => client.companyOwnerId === selectedCompany)
                      .map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName || `${client.firstName} ${client.lastName}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.toName && <span className="text-red-500 text-xs mt-1">{errors.toName.message}</span>}
              </div>

              {/* To Email */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">To Email</label>
                <Input
                  disabled={watch('status') === 'Sent'}
                {...register('toEmail')}
                placeholder="Recipient email" />
                {errors.toEmail && <span className="text-red-500 text-xs mt-1">{errors.toEmail.message}</span>}
              </div>

              {/* From Address */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">From Address</label>
                <Input
                  disabled={watch('status') === 'Sent'}
                {...register('fromAddress')}
                 placeholder="Sender address" />
                {errors.fromAddress && <span className="text-red-500 text-xs mt-1">{errors.fromAddress.message}</span>}
              </div>

              {/* To Address */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">To Address</label>
                <Input
                  disabled={watch('status') === 'Sent'}
                 {...register('toAddress')} placeholder="Recipient address" />
                {errors.toAddress && <span className="text-red-500 text-xs mt-1">{errors.toAddress.message}</span>}
              </div>

              {/* Campos opcionais gerais */}
              <div className="flex flex-col">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600 mb-1">Status</label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Void">Void</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Currency</label>
                <Input
                  disabled={watch('status') === 'Sent'}
                {...register('currency')} placeholder="USD" />
                {errors.currency && <span className="text-red-500 text-xs mt-1">{errors.currency.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Due Date</label>
                <Input
                  type="date"
                  {...register("dueDate")}
                  disabled={watch("status") === "Sent"}
                />
                {errors.dueDate && (
                  <span className="text-red-500 text-xs mt-1">{errors.dueDate.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Notes</label>
                <Input
                  disabled={watch('status') === 'Sent'}
                {...register('notes')} placeholder="Notes" />
                {errors.notes && <span className="text-red-500 text-xs mt-1">{errors.notes.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Description</label>
                <Textarea
                  disabled={watch('status') === 'Sent'}
                  {...register('description')}
                  placeholder="Description"
                  className="border border-gray-200 rounded-md p-2 text-sm resize-none"
                  rows={4}
                />
                {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
              </div>

            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Line items</h3>
                <Button
                  disabled={watch('status') === 'Sent'}
                 type="button" onClick={addItem} className="px-3 py-1 text-sm">
                  + Add item
                </Button>
              </div>

              <div className="w-full overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b border-gray-100">
                        <td className="py-2 px-3">
                          <Input
                            disabled={watch('status') === 'Sent'}
                            {...register(`lineItems.${index}.description` as const)}
                            placeholder="Item description"
                          />
                          {errors.lineItems?.[index]?.description && (
                            <span className="text-red-500 text-xs">{errors.lineItems[index]?.description?.message}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            disabled={watch('status') === 'Sent'}
                            type="number"
                            {...register(`lineItems.${index}.quantity` as const, { valueAsNumber: true })}
                            min={0}
                            placeholder="Quantity"
                          />
                          {errors.lineItems?.[index]?.quantity && (
                            <span className="text-red-500 text-xs">{errors.lineItems[index]?.quantity?.message}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            disabled={watch('status') === 'Sent'}
                            type="number"
                            step="0.01"
                            {...register(`lineItems.${index}.amount` as const, { valueAsNumber: true })}
                            min={0}
                            placeholder="Amount"
                            className="text-right"
                          />
                          {errors.lineItems?.[index]?.amount && (
                            <span className="text-red-500 text-xs">{errors.lineItems[index]?.amount?.message}</span>
                          )}
                        </td>
                        <td className="py-2 text-center">
                          <Button
                            disabled={watch('status') === 'Sent'}
                            type="button"
                            variant="secondary"
                            onClick={() => remove(index)}
                            className="text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 px-2 py-1"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end items-center mt-3 gap-4">
                <div className="text-sm text-gray-600">Subtotal:</div>
                <div className="text-sm font-semibold">{formatCurrency(total)}</div>
              </div>
            </div>
          </div>

          <div
            className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all"
            style={{ borderTop: `6px solid ` }}
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Invoice</h2>
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-gray-700">{watched.fromCompany}</div>
                </div>
              </div>

              {/* From / To section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">From</h3>
                  <p className="text-gray-600">{watched.fromCompany}</p>
                  <p className="text-gray-500">{watched.fromEmail}</p>
                  <p className="text-gray-500 text-xs">{watched.fromAddress}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">To</h3>
                  <p className="text-gray-600">{watched.toName}</p>
                  <p className="text-gray-500">{watched.toEmail}</p>
                  <p className="text-gray-500 text-xs">{watched.toAddress}</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-600">
                      <th className="py-2 px-2">Line items</th>
                      <th className="py-2 px-2">Quantity</th>
                      <th className="py-2 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watched.lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-700">{item.description || '—'}</td>
                        <td className="py-2 px-2">{Number(item.quantity) || 0}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(Number(item.amount) || 0)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200">
                      <td />
                      <td className="py-2 font-semibold text-gray-800">Total</td>
                      <td className="py-2 text-right font-semibold text-gray-800">{formatCurrency(total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="w-full max-w-md py-3 rounded-lg text-base font-medium"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md text-white py-3 rounded-lg text-base font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                  id === 'create' ? 'Create' : 'Update'
              )}
            </Button>

            {id === 'create' && <Button
              type="submit"
              disabled={isSubmitting}
              variant="secondary"
              className="w-full max-w-md py-3 rounded-lg text-base font-medium flex items-center justify-center gap-2"
              onClick={() => setAutoSend(true)}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Sending...
                </>
              ) : (
                  id === 'create' ? 'Create & Send' : 'Update & Send'
              )}
            </Button>}
          </div>

        </form>
      </Form>

       <ModalDeleteInvoice
                open={isDeleteModalOpen}
                setOpen={setIsDeleteModalOpen}
                 handleSubmit={() => {
                   invoices.deleteInvoice.mutate(id as string)
                   router.push("/invoices")
                 }}
              />
    </div>
  );
}

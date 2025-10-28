'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useInvoices, { InvoicePayload } from '@/hooks/react-query/invoices/useInvoices';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

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
  recurringInterval: '' as '' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly',
  recurringStartDate: '',
  recurringEndDate: '',
  recurringDayOfMonth: undefined as number | undefined,
  recurringEmailDayOfMonth: undefined as number | undefined,
  isRecurringTemplate: false,
  autoSendEmail: false,
  emailRecipient: '',
};

type FormValues = typeof defaultValues;

export default function Page() {
  const { data: companies } = useGetCompanies();
  const { data: clients } = useGetAllClients();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const { id } = useParams();
  const { toast } = useToast();

  const { control, register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues,
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

  useEffect(() => {
    const inv = invoices.invoiceById.data;
    if (id && inv) {
      reset({
        fromCompany: inv.company?.name || '',
        fromEmail: inv.company?.email || '',
        fromAddress: inv.company?.address || '',
        toName: `${inv.client?.firstName || ''} ${inv.client?.lastName || ''}`.trim(),
        toEmail: inv.client?.email || '',
        toAddress: `${inv.client?.address || ''}`,
        lineItems:
          inv.items?.map((item: any) => ({
            description: item.name,
            quantity: item.units,
            amount: item.pricePerUnit,
          })) || [{ description: '', quantity: 0, amount: 0 }],
        type: inv.type || 'OneTime',
        status: inv.status || 'Draft',
        currency: inv.currency || 'USD',
        notes: inv.notes || '',
        description: inv.description || '',
        recurringInterval: inv.recurringInterval || '',
        recurringStartDate: inv.recurringStartDate
          ? new Date(inv.recurringStartDate).toISOString().split('T')[0]
          : '',
        recurringEndDate: inv.recurringEndDate
          ? new Date(inv.recurringEndDate).toISOString().split('T')[0]
          : '',
        recurringDayOfMonth: inv.recurringDayOfMonth || undefined,
        recurringEmailDayOfMonth: inv.recurringEmailDayOfMonth || undefined,
        isRecurringTemplate: inv.isRecurringTemplate ?? false,
        autoSendEmail: inv.autoSendEmail ?? false,
        emailRecipient: inv.emailRecipient || '',
      });

      setSelectedCompany(inv.companyId);
      setSelectedClient(inv.clientId);
    }
  }, [id, invoices.invoiceById.data, reset]);

  const onSubmit = (data: FormValues) => {
    const isValidId = singleId && /^[0-9a-fA-F]{24}$/.test(singleId);

    const payload: InvoicePayload = {
      clientId: selectedClient,
      companyId: selectedCompany,
      amount: total,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: data.type,
      status: data.status || undefined,
      currency: data.currency || 'USD',
      notes: data.notes || undefined,
      description: data.description || undefined,
      items: data.lineItems.map((item) => ({
        name: item.description,
        pricePerUnit: Number(item.amount),
        units: Number(item.quantity),
      })),
      ...(data.type === 'Recurring' && {
        recurringInterval: data.recurringInterval || undefined,
        recurringStartDate: data.recurringStartDate
          ? new Date(data.recurringStartDate).toISOString()
          : undefined,
        recurringEndDate: data.recurringEndDate
          ? new Date(data.recurringEndDate).toISOString()
          : undefined,
        recurringDayOfMonth: data.recurringDayOfMonth || undefined,
        recurringEmailDayOfMonth: data.recurringEmailDayOfMonth || undefined,
        isRecurringTemplate: data.isRecurringTemplate ?? true,
        autoSendEmail: data.autoSendEmail ?? false,
        emailRecipient: data.emailRecipient || undefined,
      }),
    };

    if (isValidId) {
      const { clientId, companyId, ...updatePayload } = payload;

      if (data.type === 'Recurring') {
        invoices.createRecurringTemplate.mutate(payload, {
          onSuccess: () =>
            toast({
              title: 'Recurring invoice updated successfully',
              variant: 'success',
            }),
          onError: (err) =>
            toast({
              title: 'Error updating recurring invoice',
              description: err.message,
              variant: 'destructive',
            }),
        });
      } else {
        invoices.updateInvoice.mutate(
          { invoiceId: id as string, payload: updatePayload },
          {
            onSuccess: () =>
              toast({
                title: 'Invoice updated successfully',
                variant: 'success',
              }),
            onError: (err) =>
              toast({
                title: 'Error updating invoice',
                description: err.message,
                variant: 'destructive',
              }),
          }
        );
      }
    } else {
      // Criação
      if (data.type === 'Recurring') {
        invoices.createRecurringTemplate.mutate(payload, {
          onSuccess: (template) =>
            toast({
              title: 'Recurring template created!',
              description: `ID: ${template.id}`,
              variant: 'success',
            }),
          onError: (err) =>
            toast({
              title: 'Error creating recurring template',
              description: err.message,
              variant: 'destructive',
            }),
        });
      } else {
        invoices.createInvoice.mutate(payload, {
          onSuccess: (invoice) =>
            toast({
              title: 'Invoice created successfully!',
              description: `ID: ${invoice.id}`,
              variant: 'success',
            }),
          onError: (err) =>
            toast({
              title: 'Error creating invoice',
              description: err.message,
              variant: 'destructive',
            }),
        });
      }
    }
  };

  const addItem = () => append({ description: '', quantity: '', amount: '' });

  const onChangeNumber = (index: number, field: 'quantity' | 'amount', value: string) => {
    const numeric = value === '' ? '' : Number(value);
    setValue(`lineItems.${index}.${field}` as const, numeric as any, { shouldValidate: false, shouldDirty: true });
  };

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  // console.log('selectedCompany', selectedCompany)
  // console.log('selectedClient', selectedClient)

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <Form control={control}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-6 items-center">

          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold mb-2">Edit Invoice Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Tipo de Invoice */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Invoice Type</label>
                <Select
                  value={watched.type || 'OneTime'}
                  onValueChange={(value) => setValue('type', value as 'OneTime' | 'Recurring')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OneTime">One-time</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* From Company */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">From (Company)</label>
                <Select
                  value={selectedCompany}
                  onValueChange={(value) => {
                    setSelectedCompany(value);
                    const company = companies.find((c) => c.id === value);
                    if (company) {
                      setValue('fromCompany', company.name);
                      setValue('fromEmail', company.email || '');
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
              </div>

              {/* From Email */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">From Email</label>
                <Input {...register('fromEmail')} placeholder="Email address" />
              </div>

              {/* To Client */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">To (Client)</label>
                <Select
                  disabled={!selectedCompany}
                  value={selectedClient}
                  onValueChange={(value) => {
                    setSelectedClient(value);
                    const client = clients?.find((c) => c.id === value);
                    if (client) {
                      setValue('toName', `${client.firstName} ${client.lastName}`);
                      setValue('toEmail', client.email || '');
                      setValue('toAddress', `${client.address || ''}, ${client.city || ''}, ${client.state || ''} ${client.zip || ''}`);
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
              </div>

              {/* To Email */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">To Email</label>
                <Input {...register('toEmail')} placeholder="Recipient email" />
              </div>

              {/* From Address */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">From Address</label>
                <Input {...register('fromAddress')} placeholder="Sender address" />
              </div>

              {/* To Address */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">To Address</label>
                <Input {...register('toAddress')} placeholder="Recipient address" />
              </div>

              {/* Campos adicionais para recorrentes */}
              {watched.type === 'Recurring' && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Recurring Interval</label>
                    <Select onValueChange={(value) => setValue('recurringInterval', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Start Date</label>
                    <Input type="date" onChange={(e) => setValue('recurringStartDate', e.target.value)} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">End Date</label>
                    <Input type="date" onChange={(e) => setValue('recurringEndDate', e.target.value)} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Day of Month</label>
                    <Input type="number" min={1} max={31} {...register('recurringDayOfMonth')} placeholder="1-31" />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Email Day of Month</label>
                    <Input type="number" min={1} max={31} {...register('recurringEmailDayOfMonth')} placeholder="1-31" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register('isRecurringTemplate')} id="isRecurringTemplate" />
                    <label htmlFor="isRecurringTemplate" className="text-xs text-gray-600">Is Recurring Template</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register('autoSendEmail')} id="autoSendEmail" />
                    <label htmlFor="autoSendEmail" className="text-xs text-gray-600">Auto Send Email</label>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Email Recipient</label>
                    <Input type="email" {...register('emailRecipient')} placeholder="Email recipient" />
                  </div>
                </>
              )}

              {/* Campos opcionais gerais */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Status</label>
                <Select onValueChange={(value) => setValue('status', value as any)}>
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
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Currency</label>
                <Input {...register('currency')} placeholder="USD" />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Notes</label>
                <Input {...register('notes')} placeholder="Notes" />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Description</label>
                <Textarea
                  {...register('description')}
                  placeholder="Description"
                  className="border border-gray-200 rounded-md p-2 text-sm resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Line items</h3>
                <Button type="button" onClick={addItem} className="px-3 py-1 text-sm">
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
                            {...register(`lineItems.${index}.description` as const)}
                            placeholder="Item description"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            {...register(`lineItems.${index}.quantity` as const, { valueAsNumber: true })}
                            onChange={(e) => onChangeNumber(index, 'quantity', e.target.value)}
                            min={0}
                            placeholder="Quantity"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`lineItems.${index}.amount` as const, { valueAsNumber: true })}
                            onChange={(e) => onChangeNumber(index, 'amount', e.target.value)}
                            min={0}
                            placeholder="Amount"
                            className="text-right"
                          />
                        </td>
                        <td className="py-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                            className="text-sm"
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
            <Button type="submit" className="w-full text-white py-3 rounded-lg text-base font-medium">
              Save
            </Button>
            <Button type="submit" className="w-full text-white py-3 rounded-lg text-base font-medium">
              Save and send
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => {
                // reset to default example items
                setValue('lineItems', defaultValues.lineItems as any);
                setValue('fromCompany', defaultValues.fromCompany);
                setValue('fromEmail', defaultValues.fromEmail);
                setValue('fromAddress', defaultValues.fromAddress);
                setValue('toName', defaultValues.toName);
                setValue('toEmail', defaultValues.toEmail);
                setValue('toAddress', defaultValues.toAddress);
              }}
              className="w-36"
            >
              Reset
            </Button> */}
          </div>

        </form>
      </Form>
    </div>
  );
}

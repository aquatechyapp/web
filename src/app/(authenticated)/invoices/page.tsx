'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { useUserStore } from '@/store/user';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';

const defaultValues = {
  fromCompany: 'TechVista Solutions',
  fromEmail: 'invoicing@techvista.com',
  fromAddress: '123 Third Street, San Francisco, CA',
  toName: 'Benny Younes',
  toEmail: 'benny@starlight.com',
  toAddress: '321 Beverly Blvd, Los Angeles, CA',
  lineItems: [
    { description: 'AI Chatbot / Enterprise', quantity: 1, amount: 1000 },
    { description: 'Integration fee', quantity: 1, amount: 300 },
  ],
};

const COLORS = [
  { name: 'gray', value: '#E5E7EB' },
  { name: 'green', value: '#C7E8C1' },
  { name: 'purple', value: '#E3D1F5' },
  { name: 'orange', value: '#F7D4B2' },
  { name: 'blue', value: '#C9DBF8' },
];

type FormValues = typeof defaultValues;

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { data: companies } = useGetCompanies();
  const { data: clients } = useGetAllClients();
  const { data: members } = useGetMembersOfAllCompaniesByUserId(user.id);

  const { control, register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  const watched = watch();
  const total = (watched.lineItems || []).reduce((acc, it) => {
    const q = Number(it.quantity) || 0;
    const a = Number(it.amount) || 0;
    return acc + q * a;
  }, 0);

  const onSubmit = (data: FormValues) => {
    console.log('Invoice saved:', data);
  };

  const addItem = () => {
    append({ description: '', quantity: 1, amount: 0 });
  };

  const onChangeNumber = (index: number, field: 'quantity' | 'amount', value: string) => {
    // sanitize and set numeric value
    const numeric = value === '' ? '' : Number(value);
    setValue(`lineItems.${index}.${field}` as const, numeric as any, { shouldValidate: false, shouldDirty: true });
  };

  const formatCurrency = (n: number) => {
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 md:p-10">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Hassle-free and <span className="italic">actually free</span> invoice generator
      </h1>

      <Form control={control}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-3xl gap-6 items-center">

          {/* Editable Card */}
          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Invoice Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-600">From (Company)</label>
                <Input {...register('fromCompany')} placeholder="Company name" className="mt-1" />
              </div>

              <div>
                <label className="text-xs text-gray-600">From Email</label>
                <Input {...register('fromEmail')} placeholder="Email address" className="mt-1" />
              </div>

              <div>
                <label className="text-xs text-gray-600">To (Name)</label>
                <Input {...register('toName')} placeholder="Recipient name" className="mt-1" />
              </div>

              <div>
                <label className="text-xs text-gray-600">To Email</label>
                <Input {...register('toEmail')} placeholder="Recipient email" className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-600">From Address</label>
                <Input {...register('fromAddress')} placeholder="Sender address" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-600">To Address</label>
                <Input {...register('toAddress')} placeholder="Recipient address" className="mt-1" />
              </div>
            </div>
            {/* Color Picker */}
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-gray-600 font-medium">Invoice color</span>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.value)}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-all',
                      selectedColor === c.value ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
            {/* Line items editor */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Line items</h3>
                <div className="flex items-center gap-2">
                  <Button type="button" onClick={addItem} className="px-3 py-1 text-sm">
                    + Add item
                  </Button>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                      <th className="w-1/2 py-2">Description</th>
                      <th className="w-1/6 py-2">Quantity</th>
                      <th className="w-1/6 py-2 text-right">Amount</th>
                      <th className="w-1/6 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id}
                      // className="border-b border-gray-100"
                      >
                        <td className="py-2 pr-2">
                          <Input
                            {...register(`lineItems.${index}.description` as const)}
                            placeholder="Item description"
                            className="w-full"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            type="number"
                            {...register(`lineItems.${index}.quantity` as const, { valueAsNumber: true })}
                            onChange={(e) => onChangeNumber(index, 'quantity', e.target.value)}
                            className="w-full"
                            min={0}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`lineItems.${index}.amount` as const, { valueAsNumber: true })}
                            onChange={(e) => onChangeNumber(index, 'amount', e.target.value)}
                            className="w-full text-right"
                            min={0}
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

                {/* Small summary */}
                <div className="flex justify-end items-center mt-3 gap-4">
                  <div className="text-sm text-gray-600">Subtotal:</div>
                  <div className="text-sm font-semibold">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div
            className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all"
            style={{ borderTop: `6px solid ${selectedColor}` }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Invoice</h2>
                <div className="text-right">
                  <div className="font-semibold text-gray-700">{watched.fromCompany}</div>
                  <div className="text-xs text-gray-500">PO-12345</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
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

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-600">
                    <th className="py-2">Line items</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {watched.lineItems.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{item.description || '—'}</td>
                      <td className="py-2">{Number(item.quantity) || 0}</td>
                      <td className="py-2 text-right">{formatCurrency(Number(item.amount) || 0)}</td>
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

          <div className="flex w-full gap-2">
            <Button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700">
              Save Invoice →
            </Button>
            <Button
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
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}

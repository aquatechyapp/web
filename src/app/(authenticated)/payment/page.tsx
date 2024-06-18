'use client';

import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/user';
import { clientAxios } from '@/lib/clientAxios';
interface Invoice {
  createdAt: string;
  dueDate: string;
  id: string;
  invoiceNumber: string;
  item: string;
  paymentMethod: string | null;
  status: string;
  updatedAt: string;
  userId: string;
  value: number;
}

const locale = 'en-US';

const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
} as any;

export default function Payment() {
  const { user } = useUserContext();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  // const router = useRouter();
  // const { session_id } = router.query;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await clientAxios.get('/invoices');
        setInvoices(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  const handleCheckout = async (invoiceId: string) => {
    setLoadingInvoices((prev) => ({ ...prev, [invoiceId]: true }));
    try {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        const { data } = await axios.post('/api/checkout_sessions', {
          customerInfo: {
            email: user?.email,
            name: user?.firstName,
            address: user?.address,
            price: invoice.value,
            id: invoiceId
          },
          productInfo: {
            name: invoice.item,
            price: invoice.value,
            description: `Invoice #${invoice.invoiceNumber}`
          }
        });

        // Redireciona para a página de checkout do Stripe
        window.location.href = data.url;

        // Mostra toast de sucesso
        toast({
          variant: 'default',
          title: 'Checkout started',
          description: 'Redirecting to payment page...',
          className: 'bg-green-500 text-white'
        });
      } else {
        console.error('Invoice not found.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invoice not found.',
          className: 'bg-red-500 text-white'
        });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: 'destructive',
        title: 'Error starting checkout',
        description: 'Unable to create checkout session.',
        className: 'bg-red-500 text-white'
      });
    } finally {
      setLoadingInvoices((prev) => ({ ...prev, [invoiceId]: false }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Invoices</h1>
      {invoices.length > 0 ? (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-lg bg-white p-4 shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center justify-start">
                    <h2 className="mr-2 text-xl font-semibold">{invoice.item}</h2>
                    <span
                      className={`rounded px-2 py-1 ${invoice.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Price: US${(invoice.value / 100).toFixed(2)}</p>
                    <p className="text-gray-600">
                      Due Date: {new Date(invoice.dueDate).toLocaleDateString(locale, options)}
                    </p>
                  </div>
                </div>
                <button
                  className={`mt-4 w-[100px] rounded p-3 text-white transition-colors ${invoice.status === 'succeeded' ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                  onClick={() => handleCheckout(invoice.id)}
                  disabled={loadingInvoices[invoice.id] || invoice.status === 'succeeded'}
                >
                  {loadingInvoices[invoice.id] ? 'Loading...' : invoice.status === 'succeeded' ? 'Paid out' : 'Pay'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
}

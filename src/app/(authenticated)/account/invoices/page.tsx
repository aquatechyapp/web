'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { clientAxios } from '@/lib/clientAxios';
import { useUserStore } from '@/store/user';

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

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
};

export default function Invoices() {
  const user = useUserStore((state) => state.user);
  const { width } = useWindowDimensions();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState<{ [key: string]: boolean }>({});
  const [checkoutInvoiceId, setCheckoutInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [success, setSuccess] = useState<string | null>(null);
  const [canceled, setCanceled] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      setSuccess(searchParams.get('success'));
      setCanceled(searchParams.get('canceled'));
      if (searchParams.get('success') === 'true') {
        const invoiceId = searchParams.get('invoiceId');
        if (invoiceId) {
          setCheckoutInvoiceId(invoiceId);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const handlePaymentSuccess = async (invoiceId: string, newStatus: string) => {
      const response = await clientAxios.patch('/invoices', { invoiceId, newStatus });
      if (response) {
        // Use os dados da fatura atualizada conforme necessário
        toast({
          variant: 'default',
          title: 'Payment Successful',
          description: `Your payment was successful and the invoice status is now ${response.status}.`,
          className: 'bg-green-500 text-white'
        });
        // Atualizar a lista de faturas após o pagamento
        const updatedInvoices = invoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: response.status } : invoice
        );
        setInvoices(updatedInvoices);
      }
      setCheckoutInvoiceId(null);
    };

    if (checkoutInvoiceId) {
      handlePaymentSuccess(checkoutInvoiceId, 'processing');
    }
  }, [checkoutInvoiceId, invoices, toast]);

  useEffect(() => {
    if (success === 'true' && checkoutInvoiceId) {
      setCheckoutInvoiceId((prev) => prev); // Trigger re-render
    } else if (canceled === 'true') {
      toast({
        variant: 'destructive',
        title: 'Payment Canceled',
        description: 'Your payment was canceled.',
        className: 'bg-red-500 text-white'
      });
    }
  }, [success, canceled, checkoutInvoiceId, toast]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await clientAxios.get('/invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching invoices',
          description: 'Unable to load invoices. Please try again later.',
          className: 'bg-red-500 text-white'
        });
      }
    };

    fetchInvoices();
  }, [toast]);

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

        // Armazena o ID da fatura em checkout
        setCheckoutInvoiceId(invoiceId);

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
      <h1 className={`mb-4 font-bold ${width < 640 ? 'text-xl' : 'text-2xl'}`}>Invoices</h1>
      {invoices.length > 0 ? (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-lg bg-white p-4 shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center justify-start">
                    <h2 className={`mr-2 font-semibold ${width < 640 ? 'text-lg' : 'text-xl'}`}>{invoice.item}</h2>
                  </div>
                  <div className="items-center justify-center">
                    <p className={`text-gray-600 ${width < 640 ? 'text-sm' : 'text-base'}`}>
                      Price: US${(invoice.value / 100).toFixed(2)}
                    </p>
                    <p className={`text-gray-600 ${width < 640 ? 'text-sm' : 'text-base'}`}>
                      Due Date: {new Date(invoice.dueDate).toLocaleDateString(locale, options)}
                    </p>
                    <span className={`text-gray-600 ${width < 640 ? 'text-sm' : 'text-base'}`}>
                      Status: {invoice.status}
                    </span>
                  </div>
                </div>
                <button
                  className={`mt-4 w-[100px] rounded p-3 text-white transition-colors ${invoice.status === 'succeeded' || invoice.status === 'processing' ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                  onClick={() => handleCheckout(invoice.id)}
                  disabled={
                    loadingInvoices[invoice.id] || invoice.status === 'succeeded' || invoice.status === 'processing'
                  }
                >
                  {loadingInvoices[invoice.id]
                    ? 'Loading...'
                    : invoice.status === 'succeeded'
                      ? 'Paid out'
                      : invoice.status === 'processing'
                        ? 'Processing'
                        : 'Pay'}
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

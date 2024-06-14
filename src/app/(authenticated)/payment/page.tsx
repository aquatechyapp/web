'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

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

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await clientAxios.get('/invoices');
        setInvoices(response.data);
        console.log(response.data); // Aqui você acessa os dados da resposta
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (invoices.length > 0) {
        const invoice = invoices[0]; // Use a primeira fatura

        const { data } = await axios.post('/api/checkout_sessions', {
          customerInfo: {
            email: user?.email,
            name: user?.firstName,
            address: user?.address,
            price: invoice.value
          },
          productInfo: {
            name: invoice.item, // Nome do produto
            description: `Invoice #${invoice.invoiceNumber}`, // Descrição do produto
            price: invoice.value // Valor em centavos
          }
        });

        // Redireciona para a página de checkout do Stripe
        window.location.href = data.url;
      } else {
        console.error('No invoices available to process payment.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Trate o erro aqui, se necessário
    } finally {
      setLoading(false);
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
                <h2 className="text-xl font-semibold">{invoice.item}</h2>
                <span
                  className={`rounded px-2 py-1 ${invoice.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {invoice.status}
                </span>
              </div>
              <p className="text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
              <p className="text-gray-600">Value: {(invoice.value / 100).toFixed(2)} R$</p>
              <p className="text-gray-600">Created At: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <button
                className="mt-4 w-full rounded bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Loading...' : `Pay ${invoice.value / 100} R$`}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
}

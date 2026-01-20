'use client';

import { DollarSign, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Invoice } from '../utils/fakeData';

interface InvoiceSummaryCardsProps {
  invoices: Invoice[];
}

export function InvoiceSummaryCards({ invoices }: InvoiceSummaryCardsProps) {
  const now = new Date();
  
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidCount = invoices.filter(inv => inv.status === 'unpaid').length;
  const overdueCount = invoices.filter(inv => 
    inv.status === 'overdue' || (new Date(inv.dueDate) < now && inv.status !== 'paid' && inv.status !== 'cancelled')
  ).length;
  const draftCount = invoices.filter(inv => inv.status === 'draft').length;
  
  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const unpaidAmount = invoices
    .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const cards = [
    {
      title: 'Total Invoices',
      value: totalInvoices.toString(),
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Amount',
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Paid',
      value: paidCount.toString(),
      subValue: `$${paidAmount.toFixed(2)}`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Unpaid',
      value: unpaidCount.toString(),
      subValue: `$${unpaidAmount.toFixed(2)}`,
      icon: Clock,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Overdue',
      value: overdueCount.toString(),
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${card.bgColor} p-2`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
              {card.subValue && (
                <p className="mt-1 text-sm text-gray-600">{card.subValue}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


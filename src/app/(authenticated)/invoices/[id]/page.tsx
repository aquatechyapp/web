'use client';

import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUserStore } from '@/store/user';
import { DetailedInvoice } from '../utils/fakeData';
import { Invoice } from '@/ts/interfaces/Invoice';
import useGetInvoiceById from '@/hooks/react-query/invoices/useGetInvoiceById';
import { useSendInvoice } from '@/hooks/react-query/invoices/useSendInvoice';
import { useSendInvoiceReminder } from '@/hooks/react-query/invoices/useSendInvoiceReminder';
import { useDownloadInvoicePDF } from '@/hooks/react-query/invoices/useDownloadInvoicePDF';
import { useDeleteInvoice } from '@/hooks/react-query/invoices/useDeleteInvoice';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { InvoiceView } from './InvoiceView';
import { InvoiceActions } from './InvoiceActions';

type Props = {
  params: {
    id: string;
  };
};

// Transform API Invoice to DetailedInvoice format for compatibility with existing components
function transformInvoiceToDetailed(apiInvoice: Invoice): DetailedInvoice {
  // Format client address from separate fields
  const clientAddressParts = [
    apiInvoice.client.address,
    apiInvoice.client.city,
    apiInvoice.client.state,
    apiInvoice.client.zip
  ].filter(Boolean);
  
  const clientAddress = clientAddressParts.length > 0
    ? clientAddressParts.join(', ')
    : undefined;

  // Backend stores prices in cents; convert to dollars for display
  const toDollars = (cents: number) => (cents ?? 0) / 100;

  const companyOwner = apiInvoice.companyOwner
    ? ({ ...apiInvoice.companyOwner } as DetailedInvoice['companyOwner'])
    : undefined;

  return {
    id: apiInvoice.id,
    invoiceNumber: apiInvoice.invoiceNumber,
    clientId: apiInvoice.clientId,
    clientName: `${apiInvoice.client.firstName} ${apiInvoice.client.lastName}`,
    issuedDate: new Date(apiInvoice.issuedDate),
    dueDate: new Date(apiInvoice.dueDate),
    amount: toDollars(apiInvoice.total), // Use total instead of deprecated amount
    status: apiInvoice.status,
    lineItems: apiInvoice.lineItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: toDollars(item.unitPrice),
      amount: toDollars(item.amount)
    })),
    subtotal: toDollars(apiInvoice.subtotal),
    taxRate: apiInvoice.taxRate,
    taxAmount: toDollars(apiInvoice.taxAmount),
    discountRate: apiInvoice.discountRate,
    discountAmount: toDollars(apiInvoice.discountAmount),
    total: toDollars(apiInvoice.total),
    paymentTerms: apiInvoice.paymentTerms || '',
    notes: apiInvoice.notes || '',
    paymentInstructions: apiInvoice.paymentInstructions || '',
    clientAddress,
    companyOwner
  };
}

export default function InvoicePage({ params: { id } }: Props) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data, isLoading, isError, error } = useGetInvoiceById(id);
  const { mutateAsync: sendInvoice, isPending: isSendingInvoice } = useSendInvoice();
  const { mutateAsync: sendReminder, isPending: isSendingReminder } = useSendInvoiceReminder();
  const { mutateAsync: downloadPDF, isPending: isDownloadingPDF } = useDownloadInvoicePDF();
  const { mutateAsync: deleteInvoice, isPending: isDeleting } = useDeleteInvoice();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/onboarding');
      return;
    }
  }, [user, router]);

  if (isError) {
    // Check if it's a 404 error (resource not found)
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.toLowerCase().includes('not found')) {
      notFound();
    }
    // For other errors, show error state
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading invoice</h2>
          <p className="text-gray-600">{errorMessage || 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <LoadingSpinner />;
  }

  const invoice = transformInvoiceToDetailed(data.invoice);

  const handleSendInvoice = async (invoiceId: string) => {
    sendInvoice({ invoiceId });
  };

  const handleSendReminder = async (invoiceId: string) => {
    sendReminder({ invoiceId });
  };

  const handleEdit = (invoice: DetailedInvoice) => {
    router.push(`/invoices/${invoice.id}/edit`);
  };

  const handleDownload = async (invoice: DetailedInvoice) => {
    await downloadPDF({ invoiceId: invoice.id });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteInvoice({ invoiceId: id });
    // Navigate back to invoices list after successful deletion
    router.push('/invoices');
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      <InvoiceActions
        invoice={invoice}
        onSendInvoice={handleSendInvoice}
        onSendReminder={handleSendReminder}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onDelete={handleDelete}
        isSendingInvoice={isSendingInvoice}
        isSendingReminder={isSendingReminder}
        isDownloading={isDownloadingPDF}
        isDeleting={isDeleting}
      />
      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice #${invoice.invoiceNumber}? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
      <InvoiceView invoice={invoice} />
    </div>
  );
}


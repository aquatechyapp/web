'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Mail, Download, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { DetailedInvoice } from '../utils/fakeData';

interface InvoiceActionsProps {
  invoice: DetailedInvoice;
  onSendInvoice?: (invoiceId: string) => Promise<void>;
  onSendReminder?: (invoiceId: string) => Promise<void>;
  onEdit?: (invoice: DetailedInvoice) => void;
  onDownload?: (invoice: DetailedInvoice) => void;
  onDelete?: () => void;
  isSendingInvoice?: boolean;
  isSendingReminder?: boolean;
  isDownloading?: boolean;
  isDeleting?: boolean;
}

export function InvoiceActions({
  invoice,
  onSendInvoice,
  onSendReminder,
  onEdit,
  onDownload,
  onDelete,
  isSendingInvoice = false,
  isSendingReminder = false,
  isDownloading = false,
  isDeleting = false
}: InvoiceActionsProps) {
  const router = useRouter();
  const [showSendInvoiceDialog, setShowSendInvoiceDialog] = useState(false);
  const [showSendReminderDialog, setShowSendReminderDialog] = useState(false);

  const handleSendInvoice = async () => {
    if (onSendInvoice) {
      await onSendInvoice(invoice.id);
    }
  };

  const handleSendReminder = async () => {
    if (onSendReminder) {
      await onSendReminder(invoice.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(invoice);
    } else {
      // Default behavior: navigate to edit page
      router.push(`/invoices/${invoice.id}/edit`);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(invoice);
    } else {
      console.log('Download invoice:', invoice);
    }
  };

  const handleBack = () => {
    router.push('/invoices');
  };

  // Determine which buttons to show based on status
  const showSendInvoice = invoice.status === 'draft';
  const showSendReminder = invoice.status !== 'cancelled' && (invoice.status === 'unpaid' || invoice.status === 'overdue');

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Invoices
      </Button>

      <div className="flex flex-wrap gap-3">
        {showSendInvoice && (
          <>
            <Button onClick={() => setShowSendInvoiceDialog(true)} disabled={isSendingInvoice}>
              <Send className="mr-2 h-4 w-4" />
              {isSendingInvoice ? 'Sending...' : 'Send Invoice'}
            </Button>
            <ConfirmActionDialog
              open={showSendInvoiceDialog}
              onOpenChange={setShowSendInvoiceDialog}
              title="Send Invoice Email"
              description={`Are you sure you want to send invoice #${invoice.invoiceNumber} to ${invoice.clientName}? The invoice will be sent via email.`}
              confirmText="Send Invoice"
              cancelText="Cancel"
              onConfirm={handleSendInvoice}
              variant="default"
            />
          </>
        )}

        {showSendReminder && (
          <>
            <Button variant="outline" onClick={() => setShowSendReminderDialog(true)} disabled={isSendingReminder}>
              <Mail className="mr-2 h-4 w-4" />
              {isSendingReminder ? 'Sending...' : 'Send Reminder'}
            </Button>
            <ConfirmActionDialog
              open={showSendReminderDialog}
              onOpenChange={setShowSendReminderDialog}
              title="Send Invoice Reminder"
              description={`Are you sure you want to send a reminder email for invoice #${invoice.invoiceNumber} to ${invoice.clientName}? This will remind them about the outstanding payment.`}
              confirmText="Send Reminder"
              cancelText="Cancel"
              onConfirm={handleSendReminder}
              variant="default"
            />
          </>
        )}

        <Button variant="outline" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </Button>

        <Button variant="outline" onClick={onDelete} disabled={isDeleting} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { ModalDeleteInvoice } from './ModalDeleteInvoice';
import { Invoice } from './columns';
import useInvoices from '@/hooks/react-query/invoices/useInvoices';
import { InvoiceStatus, ModalUpdateStatus } from './ModalUpdateStatus';
interface ActionButtonsProps {
  invoice: Invoice;
}

export function ActionButtons({ invoice }: ActionButtonsProps) {
  const { push } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { deleteInvoice, updatePaymentStatus } = useInvoices();

  const handleActionSelect = (action: 'status' | 'edit' | 'delete') => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      switch (action) {
        case 'edit':
          push(`/invoices/${invoice.id}`);
          break;
        case 'delete':
          setIsDeleteModalOpen(true);
          break;
        case 'status':
          setIsStatusModalOpen(true);
          break;
      }
    }, 0);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  return (
    <div onClick={handleDropdownClick}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleDropdownClick}>
            {isNavigating ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <BsThreeDotsVertical className="text-stone-500" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleActionSelect('edit')} disabled={isNavigating}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => handleActionSelect('delete')}
            className="text-red-500"
            disabled={isNavigating}
          >
            <div className="flex w-full items-center justify-between">
              Delete
              <DropdownMenuShortcut>
                <MdDeleteOutline size={14} />
              </DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleActionSelect('status')}>Change Status</DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalDeleteInvoice
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          handleSubmit={() => deleteInvoice.mutate(invoice.id)}
        />
      </Dialog>
      <ModalUpdateStatus
        open={isStatusModalOpen}
        setOpen={setIsStatusModalOpen}
        currentStatus={invoice.paymentStatus as InvoiceStatus}
        onConfirm={(newStatus) => {
          const paymentStatusMap: Record<
            InvoiceStatus,
            'pending' | 'overdue' | 'succeeded' | 'processing' | 'failed'
          > = {
            pending: 'pending',
            overdue: 'overdue',
            succeeded: 'succeeded',
            processing: 'processing',
            failed: 'failed',
          };

          updatePaymentStatus.mutate({
            invoiceId: invoice.id,
            paymentStatus: paymentStatusMap[newStatus],
            paidAt: new Date().toISOString(),
            paidAmount: invoice.amount,
            paymentMethod: 'Credit Card',
          });
        }}
      />

    </div>
  );
}

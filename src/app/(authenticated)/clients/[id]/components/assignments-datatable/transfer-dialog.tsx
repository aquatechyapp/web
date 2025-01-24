'use client';

import React, { useState } from 'react';

import { DialogTransferRoute } from '@/app/(authenticated)/routes/assignments/ModalTransferRoute';
import { Assignment } from '@/ts/interfaces/Assignments';
import { Button } from '@/components/ui/button';
import { ArrowLeftRightIcon } from 'lucide-react';

type CancelAssignmentDialogProps = {
  data: Assignment;
};

export default function TransferAssignmentDialog({ data }: CancelAssignmentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="icon" variant="default" className="h-8 w-8" onClick={() => setOpen(true)}>
        <ArrowLeftRightIcon className="h-4 w-4" />
      </Button>
      <DialogTransferRoute open={open} setOpen={setOpen} assignment={data} />
    </>
  );
}

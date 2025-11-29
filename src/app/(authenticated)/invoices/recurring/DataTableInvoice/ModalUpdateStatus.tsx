'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentStatus: string;
  handleSubmit: () => void;
};

export function ModalUpdateStatus({
  open,
  setOpen,
  currentStatus,
  onConfirm,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentStatus: string;
  onConfirm: (status: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleSubmit = () => {
    onConfirm(selectedStatus);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Invoice Status</DialogTitle>
          <DialogDescription>Select a new status for this invoice</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {['Draft','Paid'].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Status</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


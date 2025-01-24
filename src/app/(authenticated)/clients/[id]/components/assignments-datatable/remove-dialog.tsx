'use client';

import React, { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineFreeCancellation } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteService } from '@/hooks/react-query/services/deleteService';
import { PoolAssignmentsPopulated } from './columns';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useRemoveAssignmentService } from '@/hooks/react-query/assignments/removeAssignment';

type RemoveAssignmentDialogProps = {
  assignmentId: string;
};

export default function RemoveAssignmentDialog({ assignmentId }: RemoveAssignmentDialogProps) {
  const { toast } = useToast();

  const removeAssignmentService = useRemoveAssignmentService();

  async function handleConfirm() {
    await removeAssignmentService.mutateAsync({
      assignmentId
    });
  }

  return (
    <ConfirmActionDialog
      trigger={
        <Button size="icon" variant="danger" className="h-8 w-8">
          <MdOutlineFreeCancellation className="h-4 w-4" />
        </Button>
      }
      onConfirm={handleConfirm}
      description="Do you really want to remove the assignment?"
    />
  );
}

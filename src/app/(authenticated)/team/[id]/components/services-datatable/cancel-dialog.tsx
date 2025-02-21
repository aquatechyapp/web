'use client';

import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

import { useDeleteService } from '@/hooks/react-query/services/deleteService';

import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { useToast } from '@/components/ui/use-toast';

type DeleteServiceDialogProps = {
  serviceId: string;
  assignmentId: string;
  clientId: string;
};

export default function DeleteServiceDialog({ serviceId, assignmentId, clientId }: DeleteServiceDialogProps) {
  const { toast } = useToast();

  const cancelService = useDeleteService(clientId);

  async function handleConfirm() {
    await cancelService.mutateAsync({
      serviceId,
      assignmentId
    });
    toast({
      variant: 'success',
      title: 'Service deleted successfully',
      description: 'The service has been deleted successfully',
      duration: 3000
    });
  }

  return (
    <ConfirmActionDialog
      variant="destructive"
      trigger={
        <Button size="icon" variant="destructive">
          <FaRegTrashAlt className="h-4 w-4" />
        </Button>
      }
      onConfirm={handleConfirm}
      description="Once you delete service, you will lose all the information related"
    />
  );
}

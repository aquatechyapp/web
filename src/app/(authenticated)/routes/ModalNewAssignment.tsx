import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';
import { FormNewAssignment } from './FormNewAssignment';
import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  handleSubmit: () => void;
  form: any;
  open: boolean;
  setIsModalOpen: (open: boolean) => void;
};

export function ModalNewAssignment({
  children,
  handleSubmit,
  form,
  open,
  setIsModalOpen
}) {
  return (
    <Dialog open={open} onOpenChange={setIsModalOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-[1200px]">
        <DialogTitle>Create Assignment</DialogTitle>
        <FormNewAssignment form={form} />
        <div className="flex justify-around">
          <DialogTrigger>
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Accept
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Cancel
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

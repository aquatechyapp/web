import { MdDeleteOutline } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

type Props = {
  deletePool: () => void;
};

export function ModalDeletePool({ deletePool }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <MdDeleteOutline className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>Are you sure you want to delete this pool?</DialogDescription>
        <div className="flex w-full justify-around">
          <DialogTrigger className="w-fit" asChild>
            <Button onClick={deletePool} variant="destructive">
              Delete
            </Button>
          </DialogTrigger>
          <DialogTrigger className="w-fit" asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

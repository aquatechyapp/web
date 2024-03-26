import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';

export function ModalDeleteClient({ children, handleSubmit }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogHeader>This action cannot be undone.</DialogHeader>
        <DialogDescription>
          Once you delete the client, you will lose all the information related
        </DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger>
            <Button
              onClick={handleSubmit}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Delete
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              Cancel
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

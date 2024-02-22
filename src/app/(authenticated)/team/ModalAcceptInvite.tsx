import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export function ModalAcceptInvite({ children, handleSubmit }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogHeader></DialogHeader>
        <DialogDescription>
          Once you accept the invite, you will not be able to undo this action.
        </DialogDescription>
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
            <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              Cancel
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

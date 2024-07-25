import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../components/ui/dialog';

type Props = {
  children: React.ReactNode;
  handleSubmit: () => void;
};

export function ModalDeleteClient({ children, handleSubmit }: Props) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogHeader>This action cannot be undone.</DialogHeader>
        <DialogDescription>Once you delete the client, you will lose all the information related</DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger>
            <Button
              onClick={handleSubmit}
              className="rounded-full bg-red-500 px-4 py-2 font-bold text-gray-50 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button className="rounded-full bg-gray-500 px-4 py-2 font-bold text-gray-50 hover:bg-gray-700">
              Cancel
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

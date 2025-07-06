import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: () => void;
};

export function ModalDeleteClient({ open, setOpen, handleSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. Once you delete the client, you will lose all the information related.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-around">
          <Button
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
            className="rounded-md bg-red-500 px-4 py-2 font-bold text-gray-50 hover:bg-red-700"
          >
            Delete
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="rounded-md bg-gray-500 px-4 py-2 font-bold text-gray-50 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: () => void;
  isActive: boolean;
};

export function ModalDeactivateClient({ open, setOpen, handleSubmit, isActive }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Are you sure?</DialogTitle>
          <DialogDescription className="text-start">This action will {isActive ? 'deactivate' : 'activate'} the client. {isActive ? 'The client will no longer be active but their data will be preserved.' : 'The client will be active again.'}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-around">
          <Button
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
            variant={isActive ? 'destructive' : 'default'}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant={'outline'}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
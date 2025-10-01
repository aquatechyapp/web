import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteService } from '@/hooks/react-query/services/deleteService';
import { Service } from '@/ts/interfaces/Service';

type Props = {
  service?: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
};

export function DialogDeleteService({ service, open, setOpen, clientId }: Props) {
  const { mutate, isPending } = useDeleteService(clientId);
  if (!service) return null;
  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : setOpen}>
      <DialogContent className="max-w-md">
        <DialogTitle className="mb-2">Delete Service</DialogTitle>
        <DialogDescription className="mb-4">
          Are you sure you want to delete the service?<br />
          This action cannot be undone.
        </DialogDescription>
        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600"></div>
            <p className="text-sm text-gray-600">Deleting service...</p>
          </div>
        ) : (
          <div className="flex gap-4 pt-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                mutate(
                  { serviceId: service.id, assignmentId: service.assignmentId },
                  {
                    onSuccess: () => {
                      setOpen(false);
                    }
                  }
                );
              }}
            >
              Delete
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

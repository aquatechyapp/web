import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteService } from '@/hooks/react-query/services/deleteService';
import { Service } from '@/ts/interfaces/Service';

type Props = {
  service?: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function DialogDeleteService({ service, open, setOpen }: Props) {
  const { mutate } = useDeleteService();
  if (!service) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{service.pool?.name}</DialogTitle>
        <DialogDescription>Are you sure you want to delete this service?</DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger>
            <Button
              variant="destructive"
              onClick={() => {
                mutate({ serviceId: service.id, assignmentId: service.assignmentId });
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

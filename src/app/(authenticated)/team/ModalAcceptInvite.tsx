import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export function ModalAcceptInvite({
  children,
  handleSubmit
}: {
  children: React.ReactNode;
  handleSubmit: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogHeader></DialogHeader>
        <DialogDescription>
          Once you accept the invite, you will not be able to undo this action.
        </DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger asChild>
            <Button onClick={handleSubmit}>Accept</Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button>Cancel</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

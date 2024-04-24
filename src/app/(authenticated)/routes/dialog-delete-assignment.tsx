import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useDeleteAssignment } from '@/hooks/react-query/assignments/useDeleteAssignment';
import { Assignment } from '@/interfaces/Assignments';

type Props = {
  assignment: Assignment;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function DialogDeleteAssignment({ assignment, open, setOpen }: Props) {
  const { mutate } = useDeleteAssignment();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{assignment.pool.name}</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this assignment?
        </DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger>
            <Button
              onClick={() => {
                mutate(assignment.id);
                setOpen(false);
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Accept
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button
              onClick={() => setOpen(false)}
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

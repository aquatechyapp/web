import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteAssignment } from '@/hooks/react-query/assignments/useDeleteAssignment';
import { Assignment } from '@/ts/interfaces/Assignments';

type Props = {
  assignment?: Assignment;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function DialogDeleteAssignment({ assignment, open, setOpen }: Props) {
  const { mutate } = useDeleteAssignment();
  if (!assignment) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{assignment.pool.name}</DialogTitle>
        <DialogDescription>Are you sure you want to delete this assignment?</DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger>
            <Button
              variant="destructive"
              onClick={() => {
                mutate(assignment.id);
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

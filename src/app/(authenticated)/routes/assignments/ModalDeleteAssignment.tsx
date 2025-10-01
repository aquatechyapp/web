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
  const { mutate, isPending } = useDeleteAssignment();
  if (!assignment) return null;
  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : setOpen}>
      <DialogContent className="max-w-md">
        <DialogTitle className="mb-2">Delete Assignment</DialogTitle>
        <DialogDescription className="mb-4">
          Are you sure you want to delete the assignment?<br />
          This action cannot be undone.
        </DialogDescription>
        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-red-600"></div>
            <p className="text-sm text-gray-600">Deleting assignment...</p>
          </div>
        ) : (
          <div className="flex gap-4 pt-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                mutate(assignment.id, {
                  onSuccess: () => {
                    setOpen(false);
                  }
                });
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

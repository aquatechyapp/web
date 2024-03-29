import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';
import { FormNewAssignment } from './FormNewAssignment';
import { Button } from '@/app/_components/ui/button';
import { useCreateAssignment } from '@/hooks/react-query/assignments/createAssignment';
import { isEmpty } from '@/utils';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import { useState } from 'react';

type Props = {
  form: any;
};

export function DialogNewAssignment({ form }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = async (): Promise<boolean> => {
    const _ = form.formState.errors;
    await form.trigger();
    if (form.formState.isValid) {
      return true;
    }
    if (isEmpty(form.formState.errors)) {
      console.error('Error in the form');
    } else {
      console.error(form.formState.errors);
    }
    return false;
  };

  const { mutate, isPending } = useCreateAssignment();

  console.log(form.watch('assignmentToId'));

  async function createNewAssignment() {
    const isValid = await validateForm();
    if (isValid) {
      setIsModalOpen(false);
      mutate({
        assignmentToId: form.watch('assignmentToId'),
        poolId: form.watch('poolId'),
        weekday: form.watch('weekday'),
        frequency: form.watch('frequency'),
        startOn: form.watch('startOn'),
        endAfter: form.watch('endAfter')
      });
      form.reset();
      return;
    }

    setIsModalOpen(true);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild className="w-full">
        <Button className="w-full" type="button">
          New Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogTitle>Create Assignment</DialogTitle>
        {isPending ? <LoadingSpinner /> : <FormNewAssignment form={form} />}
        <div className="flex justify-around">
          <Button
            onClick={createNewAssignment}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Accept
          </Button>

          <Button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateAssignment } from '@/hooks/react-query/assignments/createAssignment';
import { isEmpty } from '@/utils';

import { FormNewAssignment } from './FormNewAssignment';

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

  async function createNewAssignment() {
    const isValid = await validateForm();
    if (isValid) {
      setIsModalOpen(false);
      const weekday = form.watch('weekday');
      const assignmentToId = form.watch('assignmentToId');

      mutate({
        assignmentToId,
        poolId: form.watch('poolId'),
        weekday: form.watch('weekday'),
        frequency: form.watch('frequency'),
        startOn: form.watch('startOn'),
        endAfter: form.watch('endAfter'),
        paidByService: form.watch('paidByService')
      });
      // preciso guardar o assignmentToId selecionado antes de dar reset, se não vai bugar ao criar 2 assignments seguidos
      // em um technician que não é o user logado
      form.reset();
      form.setValue('assignmentToId', assignmentToId);
      form.setValue('weekday', weekday);
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
      <DialogContent className="max-h-screen max-w-fit overflow-y-scroll">
        <DialogTitle>Create Assignment</DialogTitle>
        {isPending ? <LoadingSpinner /> : <FormNewAssignment form={form} />}
        <div className="flex justify-around">
          <Button
            onClick={createNewAssignment}
            className="rounded bg-green-500 px-4 py-2 font-bold text-gray-50 hover:bg-green-700"
          >
            Accept
          </Button>

          <Button
            onClick={() => setIsModalOpen(false)}
            className="rounded bg-gray-500 px-4 py-2 font-bold text-gray-50 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

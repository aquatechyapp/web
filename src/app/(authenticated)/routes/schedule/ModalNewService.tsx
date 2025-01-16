import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { isEmpty } from '@/utils';

import { FormNewService } from './FormNewService';
import { FormSchema } from './page';
import { useCreateService } from '@/hooks/react-query/services/createService';

export function DialogNewService() {
  const form = useFormContext<FormSchema>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = async (): Promise<boolean> => {
    const isValid = await form.trigger();

    if (isValid) {
      return true;
    }
    if (isEmpty(form.formState.errors)) {
      console.error('Error in the form');
    } else {
      console.error(form.formState.errors);
    }
    return false;
  };

  const { mutate, isPending } = useCreateService();

  async function createNewService() {
    form.setValue('assignedToId', form.getValues('assignedToId'));

    const isValid = await validateForm();

    if (isValid) {
      setIsModalOpen(false);

      const assignedToId = form.watch('assignedToId');

      mutate({
        poolId: form.watch('poolId'),
        assignedToId,
        scheduledTo: form.watch('scheduledTo')
      });
      // preciso guardar o assignmentToId selecionado antes de dar reset, se não vai bugar ao criar 2 assignments seguidos
      // em um technician que não é o user logado
      form.reset();
      form.setValue('assignedToId', assignedToId);
      return;
    }

    setIsModalOpen(true);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild className="mt-2 w-full">
        <Button className="w-full" type="button">
          New service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen w-96 rounded-md md:w-[680px]">
        <DialogTitle>Create service</DialogTitle>
        {isPending ? <LoadingSpinner /> : <FormNewService />}
        <div className="flex justify-around">
          <Button
            onClick={createNewService}
            className="rounded bg-green-500 px-4 py-2 font-bold text-gray-50 hover:bg-green-700"
          >
            Create
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

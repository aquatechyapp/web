import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog';
import InputField from '@/components/InputField';
import { Form } from 'react-hook-form';
import SelectField from '@/components/SelectField';

export function ModalEdit({ children, handleSubmit }: any) {

  return (
    <Dialog>

      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogHeader></DialogHeader>
        <DialogDescription>
                  <input/>
        </DialogDescription>
        <div className="flex justify-around">
          <DialogTrigger asChild>
            <Button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Accept
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              Cancel
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

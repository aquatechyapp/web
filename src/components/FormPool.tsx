import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { PoolTypes } from '../constants';
import { useAddPoolToClient } from '../hooks/react-query/clients/addPoolToClient';
import { poolSchema } from '../schemas/pool';
import InputField from './InputField';
import { InputFile } from './InputFile';
import { LoadingSpinner } from './LoadingSpinner';
import SelectField from './SelectField';
import StateAndCitySelect from './StateAndCitySelect';
import { Button } from './ui/button';
import { Form } from './ui/form';

const createPoolSchema = poolSchema.omit({ poolNotes: true, poolZip: true }).and(
  z.object({
    clientOwnerId: z.string().min(1),
    zip: z
      .string({
        required_error: 'Zip is required.',
        invalid_type_error: 'Zip must be a string.'
      })
      .trim()
      .min(5, {
        message: 'Zip must be between 5 and 10 (with hifen) digits.'
      }),
    notes: z
      .string({
        required_error: 'Notes is required.',
        invalid_type_error: 'Notes must be a string.'
      })
      .trim()
      .min(1, { message: 'Notes must be at least 1 character.' })
      .nullable(),
    photo: z.array(z.string()).nullable()
  })
);

export function FormPool({ clientOwnerId, handleAddPool }) {
  const form = useForm<z.infer<typeof createPoolSchema>>({
    resolver: zodResolver(createPoolSchema),
    defaultValues: {
      clientOwnerId,
      poolAddress: '',
      animalDanger: false,
      poolCity: '',
      enterSide: '',
      lockerCode: '',
      monthlyPayment: undefined,
      notes: '',
      poolType: 'Chlorine',
      poolState: '',
      zip: ''
    }
  });

  function handleImagesChange(images: never[]) {
    form.setValue('photo', images);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddPool)} className="grid gap-4">
        <div className="-mt-2 flex gap-4">
          <InputField form={form} name="poolAddress" label="Address" placeholder="Pool Address" />
          <StateAndCitySelect form={form} stateName="poolState" cityName="poolCity" />
          <InputField form={form} name="zip" label="Zip" placeholder="Pool zip" type="zip" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-4">
            <InputField form={form} name="enterSide" label="Enter side" placeholder="Enter side" />
            <InputField form={form} name="lockerCode" label="Locker code" placeholder="Locker code" />
          </div>

          <div className="grid gap-4">
            <InputField
              form={form}
              name="monthlyPayment"
              label="Monthly payment"
              placeholder="Monthly payment"
              type="currencyValue"
            />
            <SelectField name="poolType" placeholder="Chemical type" form={form} data={PoolTypes} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            className="h-40"
            type="textArea"
            form={form}
            name="notes"
            label="Pool notes"
            placeholder="Pool notes"
          />
          <div className="mt-8 h-40">
            <InputFile handleChange={handleImagesChange} />
          </div>
        </div>
        <Button variant={'default'} color="green" type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import InputField from '@/components/InputField';
import { InputFile } from '@/components/InputFile';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import { poolSchema } from '@/schemas/pool';
import { isEmpty } from '@/utils';

const createPoolSchema = poolSchema
  .omit({
    poolNotes: true,
    poolZip: true,
    poolCity: true,
    poolState: true,
    poolAddress: true
  })
  .and(
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
        // .min(1, { message: 'Notes must be at least 1 character.' })
        .optional(),
      photo: z.array(z.string()).nullable(),
      city: z
        .string({
          required_error: 'City is required.',
          invalid_type_error: 'City must be a string.'
        })
        .trim()
        .min(1, { message: 'City must be at least 1 character.' }),
      state: z
        .string({
          required_error: 'State is required.',
          invalid_type_error: 'State must be a string.'
        })
        .trim()
        .min(1, { message: 'State must be at least 1 character.' }),
      address: z
        .string({
          required_error: 'Address is required.',
          invalid_type_error: 'Address must be a string.'
        })
        .trim()
        .min(1, { message: 'Address must be at least 1 character.' }),
      monthlyPayment: z.number().nullable()
    })
  );

export function ModalAddPool({ handleAddPool, clientOwnerId, open, setOpen }) {
  const form = useForm<z.infer<typeof createPoolSchema>>({
    resolver: zodResolver(createPoolSchema),
    defaultValues: {
      clientOwnerId,
      address: '',
      animalDanger: false,
      city: '',
      enterSide: '',
      lockerCode: '',
      monthlyPayment: undefined,
      notes: undefined,
      poolType: undefined,
      state: '',
      zip: ''
    }
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  function handleImagesChange(images: never[]) {
    form.setValue('photo', images);
  }

  const validateForm = async (): Promise<boolean> => {
    const _ = form.formState.errors; // also works if you read form.formState.isValid
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

  async function handleSubmit(data) {
    const isValid = await validateForm();
    if (isValid) {
      handleAddPool(data);
      form.reset();
      setOpen(false);
      return;
    }
  }

  return (
    <>
      <DialogContent className="h-[660px] max-w-[1200px]">
        <DialogTitle>Create Pool</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            <div className="-mt-2 flex gap-4">
              <InputField form={form} name="address" label="Address" placeholder="Pool Address" />
              <StateAndCitySelect form={form} stateName="state" cityName="city" />
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
            <div className="m-auto flex w-[50%] justify-around">
              <Button onClick={() => setOpen(false)} variant={'outline'}>
                Cancel
              </Button>
              <Button variant={'default'} color="green" type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </>
  );
}

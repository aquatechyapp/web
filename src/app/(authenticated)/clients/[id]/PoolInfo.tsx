import { useForm } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';
import * as z from 'zod';

import InputField from '@/components/InputField';
import { InputFile } from '@/components/InputFile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import { useUpdatePool } from '@/hooks/react-query/pools/updatePool';
import { Pool } from '@/interfaces/Assignments';
import { poolSchema } from '@/schemas/pool';
import { filterChangedFormFields } from '@/utils/formUtils';

import { DialogEditPool } from './DialogEditPool';

const additionalFieldsSchema = z.object({
  notes: z.string().nullable(),
  monthlyPayment: z.string().nullable()
});

const poolAndAdditionalFieldsSchema = poolSchema.and(additionalFieldsSchema);

export default function PoolInfo({ pool }: { pool: Pool }) {
  const { mutate, isPending } = useUpdatePool();
  const form = useForm<z.infer<typeof poolAndAdditionalFieldsSchema>>({
    defaultValues: {
      poolAddress: pool.address || '',
      poolCity: pool.city || '',
      poolState: pool.state || '',
      monthlyPayment: pool.monthlyPayment || '',
      lockerCode: pool.lockerCode || '',
      enterSide: pool.enterSide || '',
      poolType: pool.poolType || undefined,
      notes: pool.notes || '',
      photos: pool.photos || []
    }
  });

  const monthlyPaymentChanged = form.watch('monthlyPayment') !== pool.monthlyPayment;

  const handleSubmit = () => {
    if (Object.keys(form.formState.errors).length) return;
    let data = {
      ...filterChangedFormFields(form.getValues(), form.formState.dirtyFields)
    };
    if (monthlyPaymentChanged) {
      data = {
        ...data,
        monthlyPayment: form.watch('monthlyPayment')
      };
    }
    mutate({
      data,
      poolId: pool.id
    });
  };

  if (isPending) return <LoadingSpinner />;

  return (
    <Form {...form}>
      <div className="flex h-5 w-full justify-between text-sm font-medium   text-gray-500">
        Basic information
        <div className="flex gap-4 text-lg">
          <DialogEditPool monthlyPaymentChanged={monthlyPaymentChanged} form={form} handleSubmit={handleSubmit} />
          <MdDeleteOutline className="cursor-pointer" />
        </div>
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <InputField disabled form={form} name="poolAddress" placeholder="Address" />
        <StateAndCitySelect disabled form={form} cityName="poolCity" stateName="poolState" />
        {/* <InputField form={form} placeholder="Number" /> */}
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <InputField name="monthlyPayment" form={form} placeholder="Monthly payment" type="currencyValue" disabled />
        <InputField name="lockerCode" form={form} placeholder="Gate code" disabled />
        <InputField name="enterSide" form={form} placeholder="Enter side" disabled />
        <SelectField
          value={form.watch('poolType')}
          name="poolType"
          placeholder="Chemical type"
          form={form}
          data={PoolTypes}
          disabled
        />
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <div className="h-44 w-[40%]">
          <InputField
            className="h-full"
            type="textArea"
            form={form}
            name="notes"
            placeholder="Location notes..."
            disabled
          />
        </div>

        <div className="Form mt-8 flex h-44 w-[60%] shrink grow basis-0 items-start justify-between gap-1">
          <InputFile
            handleChange={() => {}}
            defaultPhotos={form.watch('photos').map((photo) => ({
              dataURL: photo,
              file: new File([], photo.url)
            }))}
            disabled
          />
        </div>
      </div>
    </Form>
  );
}

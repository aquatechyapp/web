import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import { poolSchema } from '@/schemas/pool';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';
import * as z from 'zod';
import { DialogEditPool } from './DialogEditPool';
import { InputFile } from '@/components/InputFile';
import { useUpdatePool } from '@/hooks/react-query/pools/updatePool';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Pool } from '@/interfaces/Assignments';
import { filterChangedFormFields } from '@/utils/formUtils';

const additionalFieldsSchema = z.object({
  notes: z.string().nullable(),
  montlyPayment: z.string().nullable()
});

const poolAndAdditionalFieldsSchema = poolSchema.and(additionalFieldsSchema);

export default function PoolInfo({ pool }: { pool: Pool }) {
  const { mutate, isPending } = useUpdatePool();
  const form = useForm<z.infer<typeof poolAndAdditionalFieldsSchema>>({
    defaultValues: {
      poolAddress: pool.address || '',
      poolCity: pool.city || '',
      poolState: pool.state || '',
      montlyPayment: pool.montlyPayment || '',
      lockerCode: pool.lockerCode || '',
      enterSide: pool.enterSide || '',
      poolType: pool.poolType || undefined,
      notes: pool.notes || '',
      photos: pool.photos || []
    }
  });

  const monthlyPaymentChanged =
    form.watch('montlyPayment') !== pool.montlyPayment;

  const handleSubmit = () => {
    if (Object.keys(form.formState.errors).length) return;
    let data = {
      ...filterChangedFormFields(form.getValues(), form.formState.dirtyFields)
    };
    if (monthlyPaymentChanged) {
      data = {
        ...data,
        montlyPayment: form.watch('montlyPayment')
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
      <div className="h-5 w-full flex text-sm justify-between font-medium   text-gray-500">
        Basic information
        <div className="flex gap-4 text-lg">
          <DialogEditPool
            monthlyPaymentChanged={
              form.watch('montlyPayment') !== pool.montlyPayment
            }
            form={form}
            handleSubmit={handleSubmit}
          />
          <MdDeleteOutline className="cursor-pointer" />
        </div>
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <InputField
          disabled
          form={form}
          name="poolAddress"
          placeholder="Address"
        />
        <StateAndCitySelect
          disabled
          form={form}
          cityName="poolCity"
          stateName="poolState"
        />
        {/* <InputField form={form} placeholder="Number" /> */}
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <InputField
          name="montlyPayment"
          form={form}
          placeholder="Monthly payment"
          type="currencyValue"
          disabled
        />
        <InputField
          name="lockerCode"
          form={form}
          placeholder="Gate code"
          disabled
        />
        <InputField
          name="enterSide"
          form={form}
          placeholder="Enter side"
          disabled
        />
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
        <div className="w-[40%] h-44">
          <InputField
            className="h-full"
            type="textArea"
            form={form}
            name="notes"
            placeholder="Location notes..."
            disabled
          />
        </div>

        <div className="Form flex mt-8 h-44 w-[60%] shrink grow basis-0 items-start justify-between gap-1">
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

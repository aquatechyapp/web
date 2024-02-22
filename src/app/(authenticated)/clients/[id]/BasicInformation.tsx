import InputField from '@/app/_components/InputField';
import SelectField from '@/app/_components/SelectField';
import StateAndCitySelect from '@/app/_components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PoolTypes } from '@/constants';
import { poolSchema } from '@/schemas/pool';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import * as z from 'zod';
import { DialogEditPool } from './DialogEditPool';
import { InputFile } from '@/app/_components/InputFile';

const additionalFieldsSchema = z.object({
  notes: z.string().nullable()
});

const poolAndAdditionalFieldsSchema = poolSchema.and(additionalFieldsSchema);

export default function BasicInformation({ pool }) {
  const form = useForm<z.infer<typeof poolAndAdditionalFieldsSchema>>({
    defaultValues: {
      poolAddress: pool.address,
      poolCity: pool.city,
      poolState: pool.state,
      montlyPayment: pool.montlyPayment || '',
      lockerCode: pool.lockerCode,
      enterSide: pool.enterSide,
      poolType: pool.poolType,
      notes: pool.notes || ''
    }
  });

  return (
    <Form {...form}>
      <div className="h-5 w-full flex text-sm justify-between font-medium leading-tight tracking-tight text-zinc-500">
        Basic information
        <div className="flex gap-4 text-lg">
          <DialogEditPool form={form} />
          <MdDeleteOutline className="cursor-pointer" />
        </div>
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <InputField form={form} name="poolAddress" placeholder="Address" />
        <StateAndCitySelect
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
        />
        <InputField name="lockerCode" form={form} placeholder="Gate code" />
        <InputField name="enterSide" form={form} placeholder="Enter side" />
        <SelectField
          value={form.watch('poolType')}
          name="poolType"
          placeholder="Chemical type"
          form={form}
          data={PoolTypes}
        />
      </div>
      <div className="NotesAboutLocationCustomerWonTSeeThat font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Notes about location (customer won't see that)
      </div>
      <div className="Form inline-flex h-[100px] items-start justify-start gap-4 self-stretch">
        <div className="w-[50%]">
          <InputField
            type="textArea"
            form={form}
            name="notes"
            placeholder="Location notes..."
          />
        </div>

        <div className="Form flex w-[50%] shrink grow basis-0 items-start justify-between gap-1">
          <InputFile
            handleChange={() => {}}
            defaultPhotos={pool.photos.map((photo) => ({
              dataURL: photo,
              file: new File([], photo.url)
            }))}
          />
        </div>
      </div>
    </Form>
  );
}

import InputField from '@/app/_components/InputField';
import SelectField from '@/app/_components/SelectField';
import StateAndCitySelect from '@/app/_components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PoolTypes } from '@/constants';
import { MdOutlineEdit } from 'react-icons/md';

export function DialogEditPool({ form }) {
  const isDirty = form.formState.isDirty;
  return (
    <Dialog>
      <DialogTrigger>
        <MdOutlineEdit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>

        <InputField form={form} name="poolAddress" placeholder="Address" />
        <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
          <StateAndCitySelect
            form={form}
            cityName="poolCity"
            stateName="poolState"
          />
          {/* <InputField form={form} placeholder="Number" /> */}
        </div>
        <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
          <InputField
            disabled
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
        <div className="self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Notes about location (customer won't see that)
        </div>
        <div className="inline-flex w-full h-full items-start justify-start gap-4 self-stretch">
          <InputField
            type="textArea"
            form={form}
            name="locationNotes"
            placeholder="Location notes..."
          />
        </div>
        {isDirty && <Button type="submit">Save</Button>}
      </DialogContent>
    </Dialog>
  );
}

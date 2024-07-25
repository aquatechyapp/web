import { UseFormReturn } from 'react-hook-form';
import { MdOutlineEdit } from 'react-icons/md';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PoolTypes } from '@/constants';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  handleSubmit: () => void;
  monthlyPaymentChanged: boolean;
};

export function DialogEditPool({ form, handleSubmit, monthlyPaymentChanged }: Props) {
  const isDirty = form.formState.isDirty;

  return (
    <Dialog>
      <DialogTrigger>
        <MdOutlineEdit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-h-screen max-w-fit overflow-y-scroll">
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader> */}
          <div>
            <InputField form={form} name="address" placeholder="Address" />
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <StateAndCitySelect form={form} cityName="city" stateName="state" />
            {/* <InputField form={form} placeholder="Number" /> */}
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <InputField name="monthlyPayment" form={form} placeholder="Monthly payment" type="currencyValue" />
            <InputField name="lockerCode" form={form} placeholder="Gate code" />
            <InputField name="enterSide" form={form} placeholder="Enter side" />
            <SelectField
              value={form.watch('poolType')}
              name="poolType"
              placeholder="Chemical type"
              form={form}
              data={PoolTypes}
              label="Chemical type"
            />
          </div>

          <div className="mb-4 h-full w-full">
            <InputField className="h-full" type="textArea" form={form} name="notes" placeholder="Location notes..." />
          </div>
          {(isDirty || monthlyPaymentChanged) && (
            <Button className="mt-4" type="submit">
              Save
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

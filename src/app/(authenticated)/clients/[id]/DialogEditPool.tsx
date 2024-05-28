import { MdOutlineEdit } from 'react-icons/md';

import InputField from '@/components/InputField';
import { InputFile } from '@/components/InputFile';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PoolTypes } from '@/constants';

export function DialogEditPool({ form, handleSubmit, monthlyPaymentChanged }) {
  const isDirty = form.formState.isDirty;

  return (
    <Dialog>
      <DialogTrigger>
        <MdOutlineEdit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-[1200px]">
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader> */}
          <div>
            <InputField form={form} name="poolAddress" placeholder="Address" />
          </div>
          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
            <StateAndCitySelect form={form} cityName="poolCity" stateName="poolState" />
            {/* <InputField form={form} placeholder="Number" /> */}
          </div>
          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
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

          <div className="inline-flex h-44 items-start justify-start gap-4 self-stretch">
            <div className="h-full w-[40%]">
              <InputField className="h-full" type="textArea" form={form} name="notes" placeholder="Location notes..." />
            </div>
            <div className="mt-6 flex h-full w-[60%] shrink grow basis-0 items-start justify-between gap-1">
              <InputFile
                handleChange={() => {}}
                defaultPhotos={form.watch('photos').map((photo) => ({
                  dataURL: photo,
                  file: new File([], photo.url)
                }))}
              />
            </div>
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

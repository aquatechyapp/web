import InputField from '@/app/_components/InputField';
import { InputFile } from '@/app/_components/InputFile';
import SelectField from '@/app/_components/SelectField';
import StateAndCitySelect from '@/app/_components/StateAndCitySelect';
import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';
import { PoolTypes } from '@/constants';
import { MdOutlineEdit } from 'react-icons/md';

export function DialogEditPool({ form, handleSubmit }) {
  const isDirty = form.formState.isDirty;

  return (
    <Dialog>
      <DialogTrigger>
        <MdOutlineEdit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-[1200px] h-[90%]">
        <form
          className="flex flex-col"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader> */}
          <div>
            <InputField form={form} name="poolAddress" placeholder="Address" />
          </div>
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
              name="montlyPayment"
              form={form}
              placeholder="Monthly payment"
              type="currencyValue"
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

          <div className="Form inline-flex items-start justify-start gap-4 self-stretch h-full">
            <div className="w-[40%] h-44">
              <InputField
                className="h-full"
                type="textArea"
                form={form}
                name="locationNotes"
                placeholder="Location notes..."
              />
            </div>
            <div className="Form flex mt-8 h-44 w-[60%] shrink grow basis-0 items-start justify-between gap-1">
              <InputFile
                handleChange={() => {}}
                defaultPhotos={form.watch('photos').map((photo) => ({
                  dataURL: photo,
                  file: new File([], photo.url)
                }))}
              />
            </div>
          </div>
          {isDirty && <Button type="submit">Save</Button>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

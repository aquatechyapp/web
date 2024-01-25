import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ChemicalSelect from './ChemicalSelect';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';

export default function AddClient() {
  return (
    <div className="inline-flex w-[100%] flex-col items-start justify-start gap-4 bg-white p-6">
      <div className="font-['Public Sans'] h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Basic information
      </div>
      <div className="inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="First name" />
        <Input placeholder="Last name" />
        <Input placeholder="Company" />
        <Input placeholder="Customer code" />
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Billing address" />
        <Input placeholder="State" />
        <Input placeholder="City" />
        <Input placeholder="Zip code" />
      </div>
      <div className="ContactInformation font-['Public Sans'] h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Contact information
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Mobile phone" />
        <Input placeholder="Mobile phone 2" />

        <Input placeholder="E-mail" />

        <Input placeholder="Invoice e-mail" />
      </div>
      <div className="NotesAboutClientCustomerWonTSeeThat font-['Public Sans'] h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Notes about client (customer won’t see that)
      </div>
      <Textarea placeholder="Type client notes here..." />
      <div className="ServiceInformation font-['Public Sans'] self-stretch  text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Service information
      </div>
      <div className="inline-flex items-start justify-start gap-2 self-stretch">
        <Checkbox id="same-billing-address" />
        <label
          htmlFor="same-billing-address"
          className="text-sm font-medium font-semibold leading-none text-gray-400"
        >
          Billing address is the same than service address.
        </label>
      </div>

      <div className="inline-flex items-start justify-start gap-2 self-stretch">
        <Checkbox id="animas-danger" />
        <label
          htmlFor="animas-danger"
          className="text-sm font-medium font-semibold leading-none text-gray-400"
        >
          It must take care with animals?
        </label>
      </div>

      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Monthly payment by client" />
        <Input placeholder="Gate code" />
        <Input placeholder="Enter side" />
        <ChemicalSelect />
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <div className="WithLabelTextArea inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
          <Textarea placeholder="Location notes..." className="h-44" />
        </div>
        <div className="WithLabelMediaUpload inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
          <div className="MediaUpload flex h-44 flex-col items-center justify-center gap-4 self-stretch rounded-lg border border-zinc-200 px-3 py-6">
            <div className="CircleIconBagde inline-flex h-9 w-9 items-center justify-center gap-2 rounded-[100px] bg-indigo-50 p-2">
              <div className="FiSrPicture relative h-4 w-4" />
            </div>
            <div className="DragAndDropImageHereOrClickAddImage font-['Public Sans'] self-stretch text-center text-sm font-normal leading-tight tracking-tight text-gray-400">
              Drag and drop locations image here, or click add images
            </div>
            <div className="PrimaryButton inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3.5 py-2.5">
              <div className="Text font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight text-neutral-800">
                Add Images
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="AssignmentInformation font-['Public Sans'] h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Assignment information
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Technician" />
        <Input placeholder="Weekday" />
        <Input placeholder="Frequency" />
        <DatePickerWithRange />
      </div>
      <Button className="w-[100%]"> Add client</Button>
    </div>
  );
  // return (
  //   <>
  //     <div className="flex w-[100%] flex-col items-start gap-4 self-stretch p-6">
  //       <div className="text-xl font-semibold">Add clients</div>

  //       <span className="text-sm  text-gray-500">Basic Information</span>
  //       <div className="flex w-[100%] items-start gap-4 self-stretch">
  // <Input placeholder="First name" />
  // <Input placeholder="Last name" />
  // <Input placeholder="Company" />
  // <Input placeholder="Customer code" />
  //       </div>
  //       <div className="flex w-[100%] items-start gap-4 self-stretch">
  // <Input placeholder="Billing address" />
  // <Input placeholder="State" />
  // <Input placeholder="City" />
  // <Input placeholder="Zip code" />
  //       </div>
  //     </div>
  //   </>
  // );
}

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function BasicInformation() {
  return (
    <>
      <div className="BasicInformation font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Basic information
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Address" />
        <Input placeholder="State" />
        <Input placeholder="City" />
        <Input placeholder="Number" />
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Monthly payment" />
        <Input placeholder="Gate code" />
        <Input placeholder="Enter side" />
        <Input placeholder="Pool type" />
      </div>
      <div className="NotesAboutLocationCustomerWonTSeeThat font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Notes about location (customer won't see that)
      </div>
      <div className="Form inline-flex h-[100px] items-start justify-start gap-4 self-stretch">
        <Textarea
          className="h-[100%] w-[50%] "
          placeholder="Location notes..."
        />
        <div className="Form flex w-[50%] shrink grow basis-0 items-start justify-between gap-1">
          <img
            className="Rectangle5 h-[100px] w-[100px] rounded-lg"
            src="https://via.placeholder.com/100x100"
          />
          <img
            className="Rectangle6 h-[100px] w-[100px] rounded-lg"
            src="https://via.placeholder.com/100x100"
          />
          <img
            className="Rectangle7 h-[100px] w-[100px] rounded-lg"
            src="https://via.placeholder.com/100x100"
          />
        </div>
      </div>
    </>
  );
}

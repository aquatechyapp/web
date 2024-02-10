import { Input } from '@/components/ui/input';
import PaymentTypeSelect from './PaymentTypeSelect';
import { Button } from '@/components/ui/button';

export default function NewClient() {
  return (
    <>
      <div className="mt-6 text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
        Add sub-contractor
      </div>
      <div className="mt-6 inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
        <div className="font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Basic information
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <Input placeholder="Address" />
          <Input placeholder="State" />
          <Input placeholder="City" />
          <Input placeholder="Zip code" />
        </div>
        <div className="font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Contact information
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <Input placeholder="Mobile phone" />
          <Input placeholder="E-mail" />
        </div>
        <div className="font-['Public Sans'] h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Payment information
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <PaymentTypeSelect />
          <Input placeholder="US$ / %" />
        </div>
        <Button className="h-10 w-full">Add sub-contractor</Button>
      </div>
    </>
  );
}

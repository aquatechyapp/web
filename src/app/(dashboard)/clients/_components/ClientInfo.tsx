import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ClientInfo() {
  return (
    <div className="Form flex h-[424px] flex-col items-start justify-start gap-4 self-stretch bg-white p-6">
      <div className="BasicInformation font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Basic information
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Billing address" />
        <Input placeholder="State" />
        <Input placeholder="City" />
        <Input placeholder="Zip code" />
      </div>
      <div className="ContactInformation font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Contact information
      </div>
      <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
        <Input placeholder="Mobile phone" />
        <Input placeholder="Mobile phone 2" />
        <Input placeholder="E-mail" />
        <Input placeholder="Invoice e-mail" />
      </div>
      <div className="NotesAboutClientCustomerWonTSeeThat font-['Public Sans'] h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Notes about client (customer won't see that)
      </div>
      <Textarea className="h-[100%]" placeholder="Type client notes here..." />
    </div>
  );
}

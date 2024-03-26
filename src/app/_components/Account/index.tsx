import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';

export default function Account() {
  return (
    <>
      <div className="mt-6 text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
        My account
      </div>
      <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
        <div className="h-5  text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Basic information
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <Input placeholder="Register as a person or as a company?" />
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
          <Input placeholder="Company" />
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <Input placeholder="Address" />
          <Input placeholder="State" />
          <Input placeholder="City" />
          <Input placeholder="Zip code" type="zip" />
        </div>
        <div className="h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Contact information
        </div>
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          <Input placeholder="Mobile phone" />
          <Input placeholder="E-mail" />
        </div>
        <Button className="h-10 w-full">Update account</Button>
      </div>
    </>
  );
}

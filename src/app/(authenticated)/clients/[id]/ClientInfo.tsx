import InputField from '@/app/_components/InputField';
import StateAndCitySelect from '@/app/_components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ClientInfo({ form }) {
  // show button only if form is differente from initial form
  return (
    <Form {...form}>
      <form className="flex flex-col items-start justify-start gap-4 self-stretch bg-white p-6">
        <div className="BasicInformation font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Basic information
        </div>
        <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
          <InputField
            form={form}
            name="clientAddress"
            placeholder="Billing address"
          />
          <StateAndCitySelect form={form} />
          <InputField form={form} name="clientZip" placeholder="Zip code" />
        </div>
        <div className="ContactInformation font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Contact information
        </div>
        <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
          <InputField
            type="phone"
            form={form}
            name="phone1"
            placeholder="Mobile phone"
          />
          {/* <InputField
            name="phone2"
            type="phone"
            form={form}
            placeholder="Mobile phone 2"
          /> */}
          <InputField form={form} name="email1" placeholder="E-mail" />

          <InputField form={form} name="email2" placeholder="Invoice e-mail" />
        </div>
        <InputField
          form={form}
          placeholder="Type client notes here..."
          name="clientNotes"
          type="textArea"
        />
        {/* <div className="NotesAboutClientCustomerWonTSeeThat font-['Public Sans'] h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Notes about client (customer won't see that)
        </div>
        <Textarea
          className="h-[100%]"
          placeholder="Type client notes here..."
        /> */}
        {form.formState.isDirty && <Button className="w-full">Save</Button>}
      </form>
    </Form>
  );
}

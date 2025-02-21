import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUpdateClient } from '@/hooks/react-query/clients/updateClient';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { FieldType, IanaTimeZones } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';
import { Company } from '@/ts/interfaces/Company';
import { useEditCompany } from '@/hooks/react-query/companies/updateCompany';
import { updateCompanySchema } from '../ModalEditCompany';

const formSchema = updateCompanySchema;

type FormData = z.infer<typeof formSchema>;

export default function CompanyInfo({ company }: { company: Company }) {
  const { handleSubmit: handleSubmitCompany, isPending } = useEditCompany();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: company.city || '',
      state: company.state || '',
      zip: company.zip || '',
      companyId: company.id || '',
      name: company.name || '',
      status: company.status || 'Active',
      phone: company.phone || '',
      address: company.address || ''
    }
  });

  if (isPending) return <LoadingSpinner />;

  const handleSubmit = async () => {
    handleSubmitCompany(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-start justify-start gap-2 self-stretch bg-gray-50"
      >
        <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField name="name" placeholder="Name" label="Name" />
          <InputField name="status" placeholder="Status" label="Status" />
        </div>
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap [&>*]:flex-1">
          <InputField name="address" placeholder="Address" label="Address" />
          <StateAndCitySelect cityName="city" stateName="state" />
          <InputField name="zip" label="Zip code" placeholder="Zip code" type={FieldType.Zip} />
        </div>
        <Typography element="h4" className="mt-2">
          Contact information
        </Typography>
        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField name="email" placeholder="E-mail" label="E-mail" />
        </div>
        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField type={FieldType.Phone} name="phone" placeholder="Phone" label="Phone" />
        </div>

        <Button type="submit" className="mt-2 w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}

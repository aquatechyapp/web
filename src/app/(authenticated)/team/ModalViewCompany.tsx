import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { paymentType } from '@/constants';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';

import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { useEditCompany } from '@/hooks/react-query/companies/updateCompany';
import { Company } from '@/ts/interfaces/Company';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';

const schema = z.object({
  companyId: z
    .string({
      required_error: 'companyId is required.',
      invalid_type_error: 'companyId must be a string.'
    })
    .trim()
    .min(1, { message: 'companyId must be at least 1 character.' }),
  name: z
    .string({
      required_error: 'name is required.',
      invalid_type_error: 'name must be a string.'
    })
    .trim()
    .min(1, { message: 'name must be at least 1 character.' })
    .optional(),
  phone: z
    .string({
      required_error: 'Phone is required.',
      invalid_type_error: 'Phone must be a string.'
    })
    .trim()
    .min(1, { message: 'phone1 must be at least 1 character.' })
    .optional(),
  address: z
    .string({
      required_error: 'address is required.',
      invalid_type_error: 'address must be a string.'
    })
    .trim()
    .min(1, { message: 'address must be at least 1 character.' })
    .optional(),
  city: z
    .string({
      required_error: 'city is required.',
      invalid_type_error: 'city must be a string.'
    })
    .trim()
    .min(1, { message: 'city must be at least 1 character.' })
    .optional(),
  state: z
    .string({
      required_error: 'state is required.',
      invalid_type_error: 'state must be a string.'
    })
    .trim()
    .min(1, { message: 'state must be at least 1 character.' })
    .optional(),
  zip: z
    .string({
      required_error: 'zip is required.',
      invalid_type_error: 'zip must be a string.'
    })
    .trim()
    .min(1, { message: 'zip must be at least 1 character.' })
    .optional(),
  status: z
    .enum(['Active', 'Inactive'], {
      required_error: 'status is required.',
      invalid_type_error: "status must be 'Active' or 'Inactive'."
    })
    .optional()
});

export type FormSchema = z.infer<typeof schema>;

type PropsView = {
  children: React.ReactNode;
  companyId: string;
};

export function ModalViewCompany({ children, companyId }: PropsView) {
  const { data: companies, isLoading } = useGetCompanies();

  // search on user.workRelationsAsAEmployer and user.workRelationsAsASubcontractor

  let selectedCompany: Company | undefined = undefined;
  selectedCompany = companies.find((company) => company.id === companyId);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedCompany?.name,
      phone: selectedCompany?.phone,
      address: selectedCompany?.address,
      city: selectedCompany?.city,
      state: selectedCompany?.state,
      zip: selectedCompany?.zip,
      status: selectedCompany?.status
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>View company</DialogTitle>
        <DialogHeader></DialogHeader>
        <Form {...form}>
          <form>
            <div className="inline-flex w-full flex-col items-start justify-start gap-8">
              <div className="justify-start self-stretch">
                <div className="mb-4">
                  <InputField name="name" label="Name" disabled placeholder="name" />
                </div>

                <div className="mb-4">
                  <InputField name="phone" label="Phone" disabled placeholder="phone" />
                </div>

                <div className="mb-4">
                  <InputField name="address" label="Address" disabled placeholder="Address" />
                </div>

                <div className="mb-4">
                  <InputField name="city" label="City" disabled placeholder="City" />
                </div>

                <div className="mb-4">
                  <InputField name="state" label="State" disabled placeholder="State" />
                </div>

                <div className="mb-4">
                  <InputField name="zip" label="Zip" disabled placeholder="Zip" />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

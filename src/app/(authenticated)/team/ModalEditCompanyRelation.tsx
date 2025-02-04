import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import InputField from '@/components/InputField';
import { Form } from '@/components/ui/form';

import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { CompanyWithMyRole } from '@/ts/interfaces/Company';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { useAcceptCompanyInvitation } from '@/hooks/react-query/companies/acceptCompanyInvitation';
import { useDeleteCompanyMember } from '@/hooks/react-query/companies/deleteCompanyMember';
import { useUserStore } from '@/store/user';

const schema = z.object({
  name: z
    .string({
      required_error: 'name is required.',
      invalid_type_error: 'name must be a string.'
    })
    .trim()
    .min(1, { message: 'name must be at least 1 character.' }),
  role: z
    .string({
      required_error: 'role is required.',
      invalid_type_error: 'role must be a string.'
    })
    .trim()
    .min(1, { message: 'role must be at least 1 character.' }),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'status is required.',
    invalid_type_error: 'status must be either active or inactive.'
  }),
  companyId: z
    .string({
      required_error: 'companyId is required.',
      invalid_type_error: 'companyId must be a string.'
    })
    .trim()
    .min(1, { message: 'companyId must be at least 1 character.' }),
  userCompanyId: z
    .string({
      required_error: 'userCompanyId is required.',
      invalid_type_error: 'userCompanyId must be a string.'
    })
    .trim()
    .min(1, { message: 'userCompanyId must be at least 1 character.' })
});

export type FormSchema = z.infer<typeof schema>;

type PropsView = {
  children: React.ReactNode;
  companyId: string;
};

export function ModalEditCompanyRelation({ children, companyId }: PropsView) {
  const { data: companies, isLoading } = useGetCompanies();
  const user = useUserStore((state) => state.user);
  const { mutate: handleAcceptUserCompanyInvitation } = useAcceptCompanyInvitation();
  const { isPending, mutate: handleDeleteUserCompanyRelation } = useDeleteCompanyMember();

  // search on user.workRelationsAsAEmployer and user.workRelationsAsASubcontractor

  let selectedCompany: CompanyWithMyRole | undefined = undefined;
  selectedCompany = companies.find((company) => company.id === companyId);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedCompany?.name,
      role: selectedCompany?.role,
      status: selectedCompany?.status,
      userCompanyId: selectedCompany?.userCompanyId
    }
  });

  function handleInvitation() {
    const values = form.getValues();
    const companyId = selectedCompany?.id;
    if (!companyId) return;
    if (selectedCompany?.status === 'Inactive') {
      handleAcceptUserCompanyInvitation({ userCompanyId: values.userCompanyId, status: 'Active' });
    } else {
      handleDeleteUserCompanyRelation({
        companyId: selectedCompany!.id,
        memberId: user.id
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>Edit company relation</DialogTitle>
        <DialogHeader></DialogHeader>
        <Form {...form}>
          <form onSubmit={handleInvitation}>
            <div className="inline-flex w-full flex-col items-start justify-start gap-8 bg-white">
              <div className="justify-start self-stretch">
                <div className="mb-4">
                  <InputField name="name" label="Name" placeholder="name" />
                </div>
                <div className="mb-4">
                  <InputField name="role" label="Role" placeholder="role" />
                </div>
              </div>
              <DialogTrigger asChild>
                <Button className="w-full" type="submit">
                  {selectedCompany?.status === 'Active' ? 'Quit' : 'Accept'}
                </Button>
              </DialogTrigger>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

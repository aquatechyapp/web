import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { paymentType } from '@/constants';
import { useEditRelation } from '@/hooks/react-query/edit-relation/editRelation';
import { WorkRelation } from '@/interfaces/User';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';

import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';

const schema = z.object({
  workRelationId: z
    .string({
      required_error: 'workRelationId is required.',
      invalid_type_error: 'workRelationId must be a string.'
    })
    .trim()
    .min(1, { message: 'workRelationId must be at least 1 character.' }),
  paymentValue: defaultSchemas.monthlyPayment,
  paymentType: z.string().min(1)
});

export type FormSchema = z.infer<typeof schema>;

type PropsEdit = {
  children: React.ReactNode;
  workRelationId: string;
};

export function ModalEdit({ children, workRelationId }: PropsEdit) {
  const user = useUserStore((state) => state.user);
  const { handleSubmit } = useEditRelation();

  const selectedWorkRelation = user.subcontractors.find(
    (subcontractor: WorkRelation) => subcontractor.id === workRelationId
  );

  let selectedPaymentTypeName = undefined;
  if (selectedWorkRelation?.paymentType) {
    const selectedPaymentType = paymentType.find((type) => type.value === selectedWorkRelation.paymentType);
    if (selectedPaymentType) {
      selectedPaymentTypeName = selectedPaymentType.name;
    }
  }

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      workRelationId: workRelationId,
      paymentValue: selectedWorkRelation!.paymentValue,
      paymentType: selectedWorkRelation?.paymentType
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>Edit work relation</DialogTitle>
        <DialogHeader></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <div className="inline-flex w-full flex-col items-start justify-start gap-8 bg-white">
              <div className="justify-start self-stretch">
                <SelectField
                  data={paymentType}
                  form={form}
                  name="paymentType"
                  label="Payment Type"
                  placeholder={selectedPaymentTypeName || ''}
                />
                <div className="h-[10px]" />
                <InputField
                  form={form}
                  name="paymentValue"
                  label="Payment Value"
                  placeholder="US$ / %"
                  type={form.watch('paymentType') === 'percentageFixedByPool' ? 'percentValue' : 'currencyValue'}
                />
              </div>
              <DialogTrigger asChild>
                <Button className="w-full" type="submit">
                  Save
                </Button>
              </DialogTrigger>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { Form } from '@/components/ui/form';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserContext } from '@/context/user';
import { paymentType } from '@/constants';
import { useEditRelation } from '@/hooks/react-query/edit-relation/editRelation';

const schema = z.object({
  workRelationId: z.string({
    required_error: "workRelationId is required.",
    invalid_type_error: "workRelationId must be a string.",
  }).trim().min(1, { message: "workRelationId must be at least 1 character." }),
  paymentValue: z.preprocess(
    (value) => value.replace(/\D/g, ''),
    z.coerce.number().min(1, { message: 'Required' })
  ),
  paymentType: z.string().min(1)
});

type PropsEdit = {
  children: React.ReactNode;
  workRelationId: string
}

export function ModalEdit({ children, workRelationId }: PropsEdit) {
  const {user} = useUserContext();
  const {handleSubmit} = useEditRelation();

  const selectedWorkRelation = user?.subcontractors.find(
    (subcontractor: any) => subcontractor.id === workRelationId
  );

  let selectedPaymentTypeName = undefined;
  if (selectedWorkRelation?.paymentType) {
    const selectedPaymentType = paymentType.find(type => type.value === selectedWorkRelation.paymentType);
    if (selectedPaymentType) {
      selectedPaymentTypeName = selectedPaymentType.name;
    }
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      workRelationId: workRelationId,
      paymentValue: selectedWorkRelation?.paymentValue || '',
      paymentType: selectedWorkRelation?.paymentType,
    }
  });

  return (
    <Dialog>

      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Edit work relation</DialogTitle>
        <DialogHeader></DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="inline-flex w-full flex-col items-start justify-start gap-8 bg-white">
                <div className="self-stretch justify-start">
                  <SelectField
                    data={paymentType}
                    form={form}
                    name="paymentType"
                    label="Payment Type"
                    placeholder={selectedPaymentTypeName}
                  />
                  <div className='h-[10px]' />
                  <InputField
                    form={form}
                    name="paymentValue"
                    label="Payment Value"
                    placeholder="US$ / %"
                    type={
                      form.watch('paymentType') === 'percentageFixedByPool'
                        ? 'percentValue'
                        : 'currencyValue'
                    }
                  />
                </div>
                <DialogTrigger asChild>
                <Button className='w-full' type="submit">Save</Button>
                </DialogTrigger>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

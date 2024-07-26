import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import { FieldType } from '@/constants/enums';
import { useDeletePool } from '@/hooks/react-query/pools/deletePool';
import { useUpdatePool } from '@/hooks/react-query/pools/updatePool';
import { Pool } from '@/interfaces/Assignments';
import { editPoolSchema } from '@/schemas/pool';
import { isEmpty } from '@/utils';
import { findDifferenceBetweenTwoObjects } from '@/utils/others';

import { ModalDeletePool } from './ModalDeletePool';

export default function PoolInfo({ pool, clientId }: { pool: Pool; clientId: string }) {
  const { mutate, isPending: isPendingUpdatePool } = useUpdatePool();
  const { mutate: deletePool, isPending: isPendingDeletePool } = useDeletePool(['clients', clientId], pool.id);
  const isPending = isPendingUpdatePool || isPendingDeletePool;

  const form = useForm<z.infer<typeof editPoolSchema>>({
    resolver: zodResolver(editPoolSchema),
    defaultValues: {
      poolId: pool.id,
      address: pool.address || '',
      city: pool.city || '',
      state: pool.state || '',
      monthlyPayment: pool.monthlyPayment || undefined,
      lockerCode: pool.lockerCode || '',
      enterSide: pool.enterSide || '',
      poolType: pool.poolType,
      notes: pool.notes || ''
    }
  });

  const changedFields = findDifferenceBetweenTwoObjects(form.formState.defaultValues!, form.watch());

  const handleSubmit = () => {
    if (Object.keys(form.formState.errors).length) return;

    const data = changedFields as z.infer<typeof editPoolSchema>;
    data.poolId = pool.id;

    mutate({
      data
    });
  };

  if (isPending) return <LoadingSpinner />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="flex h-5 w-full justify-between text-sm font-medium text-gray-500">
          Basic information
          <div className="flex gap-4 text-lg">
            <ModalDeletePool deletePool={() => deletePool()} />
          </div>
        </div>
        <InputField form={form} name="address" placeholder="Address" />

        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          {/* <InputField disabled form={form} name="address" placeholder="Address" /> */}
          <StateAndCitySelect form={form} cityName="city" stateName="state" />
        </div>
        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField name="monthlyPayment" form={form} placeholder="Monthly payment" type={FieldType.CurrencyValue} />
          <InputField name="lockerCode" form={form} placeholder="Gate code" />
          <InputField name="enterSide" form={form} placeholder="Enter side" />
          <SelectField
            value={form.watch('poolType')}
            name="poolType"
            placeholder="Chemical type"
            form={form}
            data={PoolTypes}
            label="Chemical type"
          />
        </div>
        <div className="Form flex flex-col items-start justify-start gap-4 self-stretch lg:flex-row">
          <div className="h-40 w-full">
            <InputField
              className="h-full"
              type={FieldType.TextArea}
              form={form}
              name="notes"
              placeholder="Location notes..."
            />
          </div>
        </div>
        {!isEmpty(changedFields) && (
          <Button className="mt-4" type="submit">
            Save
          </Button>
        )}
      </form>
    </Form>
  );
}

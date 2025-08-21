import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/ClientStateAndCitySelect';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AddressInput } from '@/components/AddressInput';
import { PoolTypes } from '@/constants';
import { useDeletePool } from '@/hooks/react-query/pools/deletePool';
import { useUpdatePool } from '@/hooks/react-query/pools/updatePool';
import { editPoolSchema } from '@/schemas/pool';
import { FieldType } from '@/ts/enums/enums';
import { Pool } from '@/ts/interfaces/Pool';
import { isEmpty } from '@/utils';
import { findDifferenceBetweenTwoObjects } from '@/utils/others';
import { ModalDeletePool } from '../ModalDeletePool';

interface PoolInfoTabProps {
  pool: Pool;
  clientId: string;
}

export default function PoolInfoTab({ pool, clientId }: PoolInfoTabProps) {
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
      notes: pool.notes || '',
      zip: pool.zip || ''
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full flex-col gap-2">
        <div className="flex h-5 w-full justify-between text-sm font-medium">
          <Typography element="h3" className="text-md">
            Basic information
          </Typography>
          <div className="flex gap-4 text-lg">
            <ModalDeletePool deletePool={() => deletePool()} />
          </div>
        </div>
        
        <AddressInput
          name="address"
          label="Address"
          placeholder="Enter address"
          onAddressSelect={({ state, city, zipCode, timezone }) => {
            form.setValue('state', state, { shouldValidate: true });
            form.setValue('city', city, { shouldValidate: true });
            form.setValue('zip', zipCode, { shouldValidate: true });
          }}
        />

        <div className="Form inline-flex flex-wrap items-start justify-start self-stretch md:flex-nowrap gap-4">
          <StateAndCitySelect cityName="city" stateName="state" />
          <InputField name="zip" label="Zip code" placeholder="Zip code" type={FieldType.Zip} />
        </div>
        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField
            label="Monthly Payment"
            name="monthlyPayment"
            placeholder="Monthly payment"
            type={FieldType.CurrencyValue}
          />
          <InputField label="Gate Code" name="lockerCode" placeholder="Gate Code" />
          <InputField label="Enter Side" name="enterSide" placeholder="Enter side" />
          <SelectField
            value={form.watch('poolType')}
            name="poolType"
            placeholder="Chemical type"
            options={PoolTypes}
            label="Chemical type"
          />
        </div>
        <div className="mt-2 w-full">
          <InputField type={FieldType.TextArea} name="notes" placeholder="Location notes..." />
        </div>
        <Button disabled={isEmpty(changedFields)} className="mt-4" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}

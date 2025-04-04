'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { clientSchema } from '@/schemas/client';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { poolSchema } from '@/schemas/pool';
import { useUserStore } from '@/store/user';

import ClientBox from './ClientBox';
import { normalizeImportData } from './normalizeImportData';

const IGNORE_FIELDS = ['animalDanger', 'clientType'];

const additionalSchemas = z.object({
  customerCode: z.string().nullable(),
  monthlyPayment: defaultSchemas.monthlyPayment,
  clientCompany: z.string().nullable(),
  clientType: z.enum(['Commercial', 'Residential']),
  timezone: defaultSchemas.timezone
});

const poolAndClientSchema = clientSchema.and(poolSchema).and(additionalSchemas);

const schema = z.object({
  csvFile: defaultSchemas.csvFile,
  clients: z.array(poolAndClientSchema)
});

export type FormData = z.infer<typeof schema>;
export type FormDataImportClients = z.infer<typeof poolAndClientSchema>;

export default function Page() {
  const form = useForm<FormData>({
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      csvFile: undefined,
      clients: []
    }
  });

  const user = useUserStore((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  const clients = useFieldArray({
    name: 'clients',
    control: form.control
  });

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormDataImportClients[]) => await clientAxios.post('/clients/many', data),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Clients created successfully',
        variant: 'success'
      });
      form.setValue('csvFile', undefined);
      form.reset();
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error importing clients',
        variant: 'error'
      });
    }
  });

  function handleImportFile(file: File | null) {
    form.trigger('csvFile');
    if (!file) {
      form.setError('csvFile', {
        type: 'required',
        message: 'There was an error importing the file. Please try again.'
      });
      return;
    }
    Papa.parse(file, {
      header: true,
      complete: (results: { data: Partial<FormDataImportClients>[] }) => {
        const result = results.data.filter((obj) => {
          // clona o objeto
          const objWithoutIgnoredFields = { ...obj };
          // remove os campos que já vem com valor default da planilha
          IGNORE_FIELDS.forEach((field) => {
            delete (
              objWithoutIgnoredFields as {
                [key: string]: string | number | boolean;
              }
            )[field];
          });
          // Filtra se algum campo não é vazio. Se tiver qualquer campo preenchido, retorna true
          return Object.values(objWithoutIgnoredFields).some((value) => value);
        });
        result.forEach((data) => {
          clients.append(normalizeImportData(data as FormDataImportClients));
        });
      }
    });
  }
  if (isPending) {
    return <LoadingSpinner />;
  }

  function handleMutate() {
    const data = clients.fields.map((client) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = client;
      return rest;
    });
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => handleMutate())}>
        <div className="flex flex-col gap-4 p-2">
          <div className="flex w-fit flex-wrap gap-4 text-nowrap md:flex-nowrap">
            <Button type="button">
              <a href="/sample-import-aquatechy.csv" download="import-sample-aquatechy">
                Download Sample File
              </a>
            </Button>
            <Form {...form}>
              <FormField
                control={form.control}
                name="csvFile"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        className="w-fit"
                        placeholder="Photo"
                        type="file"
                        accept=".csv"
                        onChange={(event) => {
                          onChange(event.target.files && event.target.files[0]);
                          handleImportFile(event.target.files && event.target.files[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>
          <div className="flex flex-col gap-4">
            {clients.fields.map((data, index) => {
              return <ClientBox key={data.id} removeClient={clients.remove} data={data} index={index} />;
            })}
          </div>
          <div className="w-full">
            <Button disabled={form.watch('clients').length <= 0} className="w-full">
              Import Clients
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

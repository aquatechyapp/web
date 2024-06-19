'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Papa from 'papaparse';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormProvider, useFormContext } from '@/context/importClients';
import { useImportClientsFromCsv } from '@/hooks/react-query/clients/importClientsFromCsv';

import ClientBox from './ClientBox';

const ACCEPTED_FILE_TYPES = ['text/csv'];

export const csvFileSchema = z.object({
  csvFile: z
    .instanceof(File)
    .refine((file) => file.size < 7000000, {
      message: 'Your file must be less than 7MB.'
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), 'Only .csv formats are supported.')
});

export default function Page() {
  const { getAllFormValues } = useFormContext();
  const [newClients, setNewClients] = useState([]);
  const { isPending, mutate } = useImportClientsFromCsv();

  const form = useForm<z.infer<typeof csvFileSchema>>({
    resolver: zodResolver(csvFileSchema),
    defaultValues: {
      csvFile: undefined
    }
  });

  const handleImportClients = () => {
    const allValues = getAllFormValues();
    // allValues is an array with Objects with Key as index and Value as form values
    // Ex.: { 0: { clientName: 'John Doe', clientEmail: '}
    // I need to transform this object into an array of objects
    // Ex.: [{ clientName: 'John Doe', clientEmail: '' }]
    // Then I can pass this array to the mutation function
    // mutate(allValues);
    console.log([{ oi: 'tchau' }]);
    const clients = allValues.map((client) => {
      console.log(client);
      return { ...client };
    });
    mutate(clients);
    console.log(clients); // All form values from ClientBox components
  };

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
      complete: (results) => {
        console.log(results);
        // filter if there are any empty rows

        setNewClients(results.data);
      }
    });
  }
  if (isPending) {
    return <LoadingSpinner />;
  }

  // console.log(form.getValues('csvFile'));

  return (
    <div className="rounded-md border">
      <div className="mx-2 my-4 flex w-fit flex-wrap gap-4 text-nowrap md:flex-nowrap">
        <Button>
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
                    placeholder="Picture"
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
        {newClients.map((data, index) => {
          return <ClientBox data={data} index={index} />;
        })}
      </div>
      <Button onClick={handleImportClients}>Import Clients</Button>
    </div>
  );
}

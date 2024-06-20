'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Papa from 'papaparse';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
  const [newClients, setNewClients] = useState([]);

  const form = useForm<z.infer<typeof csvFileSchema>>({
    resolver: zodResolver(csvFileSchema),
    defaultValues: {
      csvFile: undefined
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
      complete: (results) => {
        console.log(results);
        // Vai verificar aqui linhas vazias
        setNewClients(results.data);
        form2.reset(
          newClients.map((client, index) => {
            return {
              [`clientAddress${index}`]: client.clientAddress || ''
            };
          })
        );
      }
    });
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
      <Button>Import Clients</Button>
    </div>
  );
}

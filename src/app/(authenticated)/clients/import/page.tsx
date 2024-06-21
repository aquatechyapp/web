'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Papa from 'papaparse';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useFormContext } from '@/context/importClients';
import { clientAxios } from '@/lib/clientAxios';

import ClientBox from './ClientBox';

const ACCEPTED_FILE_TYPES = ['text/csv'];
const IGNORE_FIELDS = ['animalDanger', 'clientType'];

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
  const [hasErrorInSomeForm, setHasErrorInSomeForm] = useState(false);
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.post('/importclientsandpools', data),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Clients created successfully',
        className: 'bg-green-500 text-gray-50'
      });
      setNewClients([]);
      form.reset();
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating clients',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });

  const form = useForm<z.infer<typeof csvFileSchema>>({
    resolver: zodResolver(csvFileSchema),
    defaultValues: {
      csvFile: undefined
    }
  });

  const handleImportClients = () => {
    const allValues = getAllFormValues();

    const clients = allValues.map((client) => {
      return { ...client };
    });

    mutate(clients);
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
        const result = results.data.filter((obj) => {
          // clona o objeto
          const objWithoutIgnoredFields = { ...obj };
          // remove os campos que já vem com valor default da planilha
          IGNORE_FIELDS.forEach((field) => {
            delete objWithoutIgnoredFields[field];
          });
          // Filtra se algum campo não é vazio. Se tiver qualquer campo preenchido, retorna true
          return Object.values(objWithoutIgnoredFields).some((value) => value);
        });
        setNewClients(result);
      }
    });
  }
  if (isPending) {
    return <LoadingSpinner />;
  }

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
          return (
            <ClientBox
              hasErrorInSomeForm={hasErrorInSomeForm}
              setHasErrorInSomeForm={setHasErrorInSomeForm}
              data={data}
              index={index}
            />
          );
        })}
      </div>
      <div className="w-full p-2">
        <Button className="w-full" disabled={hasErrorInSomeForm} onClick={handleImportClients}>
          Import Clients
        </Button>
      </div>
    </div>
  );
}

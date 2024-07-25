'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { City, IState, State } from 'country-state-city';
import Papa from 'papaparse';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ImportMultipleClients } from '@/interfaces/Client';
import { clientAxios } from '@/lib/clientAxios';
import { fuseSearchStatesAndCities, simpleFuseSearch } from '@/lib/fusejs';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useFormStore } from '@/store/importClients';
import { onlyNumbers } from '@/utils';

import ClientBox from './ClientBox';

const IGNORE_FIELDS = ['animalDanger', 'clientType'];

const states = State.getStatesOfCountry('US');

export default function Page() {
  const { forms, updateFormValues, cleanForms } = useFormStore();
  const [hasErrorInSomeForm, setHasErrorInSomeForm] = useState(false);
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ImportMultipleClients[]) => await clientAxios.post('/importclientsandpools', data),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Clients created successfully',
        className: 'bg-green-500 text-gray-50'
      });
      form.setValue('csvFile', undefined);
      cleanForms();
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating clients',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(defaultSchemas.csvFile),
    defaultValues: {
      csvFile: undefined
    }
  });

  const handleImportClients = () => {
    mutate(forms);
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
      complete: (results: { data: ImportMultipleClients[] }) => {
        const result: ImportMultipleClients[] = results.data.filter((obj) => {
          // clona o objeto
          const objWithoutIgnoredFields = { ...obj };
          // remove os campos que já vem com valor default da planilha
          IGNORE_FIELDS.forEach((field) => {
            delete (
              objWithoutIgnoredFields as {
                [key: string]: string | number | boolean | undefined;
              }
            )[field];
          });
          // Filtra se algum campo não é vazio. Se tiver qualquer campo preenchido, retorna true
          return Object.values(objWithoutIgnoredFields).some((value) => value);
        });
        result.forEach((data, index) => {
          if (data.clientState) {
            const state = fuseSearchStatesAndCities(states, data.clientState).filter(
              (item): item is IState => 'isoCode' in item
            )[0]?.isoCode;

            if (!state) {
              data.clientState = '';
              data.clientCity = '';
            } else {
              data.clientState = state;
              data.clientCity =
                fuseSearchStatesAndCities(City.getCitiesOfState('US', state), data.clientCity!)[0]?.name || '';
            }
          }

          if (data.poolState) {
            const state = fuseSearchStatesAndCities(states, data.poolState).filter(
              (item): item is IState => 'isoCode' in item
            )[0]?.isoCode;

            if (!state) {
              data.poolState = '';
              data.poolCity = '';
            } else {
              data.poolState = state;
              data.poolCity =
                fuseSearchStatesAndCities(City.getCitiesOfState('US', state), data.poolCity!)[0]?.name || '';
            }
          }
          data.clientType = simpleFuseSearch(['Residential', 'Commercial'], data.clientType!)[0] || 'Residential';
          data.poolType = simpleFuseSearch(['Chlorine', 'Salt', 'Other'], data.poolType!)[0] || 'Chlorine';
          data.phone1 = onlyNumbers(data.phone1!).toString();
          data.animalDanger = !!data.animalDanger;
          data.monthlyPayment = onlyNumbers(data.monthlyPayment!);
          updateFormValues(index, data);
        });
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
        {forms.map((data, index) => {
          return (
            <>
              <ClientBox
                hasErrorInSomeForm={hasErrorInSomeForm}
                setHasErrorInSomeForm={setHasErrorInSomeForm}
                data={data}
                index={index}
              />
            </>
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

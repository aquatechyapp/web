'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import SelectField from '@/components/SelectField';
import { Categories, RequestStatus } from '@/constants';
import useGetRequests, { UseGetRequestsParams } from '@/hooks/react-query/requests/getRequests';
import { useUserStore } from '@/store/user';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { Client } from '@/ts/interfaces/Client';
import { buildSelectOptions } from '@/utils/formUtils';
import { Input } from '@/components/ui/input';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';
import { ModalAddRequest } from './ModalAddRequest';
import DataTableRequestsSkeleton from './DataTableRequests/skeleton';
import { PaginationDemo } from '@/components/PaginationDemo';

const defaultValues: UseGetRequestsParams = {
  from: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
  to: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
  status: 'Pending',
  category: null,
  clientId: null,
  companyId: null,
  page: 1,
  limit: 20
};

const countAppliedFilters = (filters: UseGetRequestsParams): number => {
  return Object.keys(filters).reduce((count, key) => {
    const currentValue = filters[key as keyof UseGetRequestsParams];
    const defaultValue = defaultValues[key as keyof UseGetRequestsParams];

    if (currentValue === undefined || currentValue === defaultValue) return count;

    const isDate = key === 'from' || key === 'to';
    if (isDate) {
      return new Date(currentValue as string).toISOString() !== new Date(defaultValue as string).toISOString()
        ? count + 1
        : count;
    }

    return count + 1;
  }, 0);
};

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: clients } = useGetAllClients();
  const { data: companies = [] } = useGetCompanies();

  // Initialize requestsQuery with initial filters
  const [currentFilters, setCurrentFilters] = useState<UseGetRequestsParams>(defaultValues);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Match this with your backend limit

  const requestsQuery = useGetRequests({
    ...currentFilters,
    page: currentPage,
    limit: itemsPerPage
  });

  const filtersForm = useForm<UseGetRequestsParams>({
    defaultValues
  });

  const formValuesListener = filtersForm.watch();
  const appliedFilters = useMemo(() => countAppliedFilters(formValuesListener), [formValuesListener]);

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  // Sync form with current filters when they change
  useEffect(() => {
    filtersForm.reset(currentFilters);
  }, [currentFilters, filtersForm]);

  const onSubmit = async (formData: UseGetRequestsParams) => {
    console.log('Form data submitted:', formData); // Debug log
    const newFilters = {
      ...formData,
      page: 1, // Reset to first page when applying filters
      limit: itemsPerPage
    };
    console.log('New filters being applied:', newFilters); // Debug log
    setCurrentPage(1);
    setCurrentFilters(newFilters);
    await requestsQuery.refetch(newFilters);
    setDialogOpen(false);
  };

  const handleClearFilters = async () => {
    filtersForm.reset(defaultValues);
    setCurrentPage(1);
    setCurrentFilters(defaultValues);
    await requestsQuery.refetch(defaultValues);
  };

  // Add state for dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = useCallback(() => {
    // Reset focus and close dialog
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setDialogOpen(false);
  }, []);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await requestsQuery.refetch({
      ...currentFilters,
      page,
      limit: itemsPerPage
    });
  };

  if (requestsQuery.isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Form {...filtersForm}>
        <form className="flex w-full flex-col gap-4" onSubmit={filtersForm.handleSubmit(onSubmit)}>
          <div className="flex flex-wrap items-center gap-2 p-4">
            <ModalAddRequest />
            <Input
              className="w-[250px]"
              placeholder="Filter clients..."
              value={filtersForm.watch('clientId') || ''}
              onChange={(event) => filtersForm.setValue('clientId', event.target.value, { shouldDirty: true })}
            />

            <FormItem className="flex items-center gap-2">
              <FormLabel className="whitespace-nowrap">From</FormLabel>
              <FormControl>
                <DatePicker
                  // className="w-full"
                  placeholder="Created From"
                  value={filtersForm.watch('from') ? new Date(filtersForm.watch('from')) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(date.setHours(0, 0, 0, 0));
                      filtersForm.setValue('from', localDate.toISOString(), { shouldDirty: true });
                    } else {
                      filtersForm.setValue('from', defaultValues.from, { shouldDirty: true });
                    }
                  }}
                />
              </FormControl>
            </FormItem>

            <FormItem className="flex items-center gap-2">
              <FormLabel className="whitespace-nowrap">To</FormLabel>
              <FormControl>
                <DatePicker
                  // className="w-full"
                  placeholder="Created To"
                  value={filtersForm.watch('to') ? new Date(filtersForm.watch('to')) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(date.setHours(23, 59, 59, 999));
                      filtersForm.setValue('to', localDate.toISOString(), { shouldDirty: true });
                    } else {
                      filtersForm.setValue('to', defaultValues.to, { shouldDirty: true });
                    }
                  }}
                />
              </FormControl>
            </FormItem>

            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  handleDialogClose();
                } else {
                  setDialogOpen(true);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  More filters
                  {filtersForm.formState.isDirty && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                      *
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-xl"
                onEscapeKeyDown={handleDialogClose}
                onInteractOutside={handleDialogClose}
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                  handleDialogClose();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Requests filter</DialogTitle>
                </DialogHeader>

                <FormItem className="w-full">
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <FormField
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField
                              placeholder="Select company"
                              {...field}
                              options={buildSelectOptions(companies, {
                                key: 'id',
                                name: 'name',
                                value: 'id'
                              })}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </FormControl>
                </FormItem>

                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <FormField
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField placeholder="Select status" {...field} options={RequestStatus} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </FormControl>
                </FormItem>

                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <FormField
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField 
                              placeholder="Select category" 
                              {...field} 
                              options={Categories}
                              onValueChange={(value) => {
                                console.log('Category selected:', value); // Debug log
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </FormControl>
                </FormItem>

                <FormItem className="w-full">
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <FormField
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField
                              placeholder={clients?.length || 0 > 0 ? 'Select client' : 'No clients available'}
                              {...field}
                              options={buildSelectOptions(
                                clients?.filter((client: Client) => client.pools.length > 0),
                                {
                                  key: 'id',
                                  name: 'fullName',
                                  value: 'id'
                                }
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </FormControl>
                </FormItem>

                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      filtersForm.handleSubmit((data) => {
                        onSubmit(data);
                        handleDialogClose();
                      })();
                    }}
                  >
                    {requestsQuery.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Apply
                  </Button>
                  {appliedFilters > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        handleClearFilters();
                        handleDialogClose();
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button type="submit" size="sm" disabled={!filtersForm.formState.isDirty && appliedFilters === 0}>
              {requestsQuery.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply
            </Button>

            {appliedFilters > 0 && (
              <Button variant="outline" onClick={handleClearFilters} size="sm">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  {appliedFilters}
                </span>
                <span>Clear</span>
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>

      {requestsQuery.isPending || requestsQuery.isLoading ? (
        <DataTableRequestsSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <DataTableRequests columns={columns} data={requestsQuery.data?.requests || []} />

          <div className="flex justify-center py-4">
            <PaginationDemo
              currentPage={currentPage}
              totalItems={requestsQuery.data?.total || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

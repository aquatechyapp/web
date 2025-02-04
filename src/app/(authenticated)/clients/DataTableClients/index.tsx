'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserStore } from '@/store/user';
import { Client } from '@/ts/interfaces/Client';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableClients<TValue>({ columns, data }: DataTableProps<Client, TValue>) {
  const shouldDisableNewPools = useUserStore((state) => state.shouldDisableNewPools);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sortColumn, setSortColumn] = useState<keyof Client | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { push } = useRouter();

  const toggleSortOrder = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId as keyof Client);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortOrder]);

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    },

    initialState: {
      columnVisibility: {
        deactivatedAt: false
      }
    }
  });

  // Defina as opções para o SelectField
  const selectOptions = [
    { key: 'all', value: 'all', name: 'All clients' },
    { key: 'active', value: 'active', name: 'Active' },
    { key: 'inactive', value: 'inactive', name: 'Inactive' }
  ];

  const form = useForm({
    defaultValues: {
      type: 'all',
      city: 'all',
      filter: 'all'
    }
  });

  // Obtendo uma lista de cidades únicas dos dados dos clientes
  const cities = Array.from(new Set(sortedData.map((client) => client.city)));
  // Definindo opções para o SelectField da cidade
  const citySelectOptions = [
    { value: 'all', name: 'All cities', key: 'all_cities' },
    ...cities.map((city) => ({ value: city, name: city, key: city }))
  ];

  const types = Array.from(new Set(sortedData.map((client) => client.type)));
  const typesSelectOptions = [
    { value: 'all', name: 'All types', key: 'all_types' },
    ...types.map((type) => ({ value: type, name: type, key: type }))
  ];

  // console.log('sortedData', sortedData);

  return (
    <>
      <div className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="flex w-full flex-col gap-4 text-nowrap md:flex-row">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button disabled={shouldDisableNewPools}>
                <PlusIcon className="mr-2" />
                <Link href={'/clients/new'}>New Client</Link>
              </Button>
            </HoverCardTrigger>
            {shouldDisableNewPools && (
              <HoverCardContent side="bottom" className="w-full">
                Upgrade your plan to add more pools.
              </HoverCardContent>
            )}
          </HoverCard>
          <Input
            placeholder="Filter clients..."
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="mb-2 mr-2 md:mb-0 md:max-w-xs"
          />
        </div>
        <div className="flex w-full">
          <Form {...form}>
            <form className="mb-2 flex w-full flex-col gap-4 md:mb-0 md:flex-row">
              <SelectField
                name="filter"
                options={selectOptions}
                placeholder="Status"
                onValueChange={(value) => table.getColumn('deactivatedAt')?.setFilterValue(value)}
              />
              <SelectField
                name="city"
                options={citySelectOptions}
                placeholder="City"
                onValueChange={(value) => table.getColumn('city')?.setFilterValue(value)}
              />
              <SelectField
                name="type"
                options={typesSelectOptions}
                placeholder="Type"
                onValueChange={(value) => table.getColumn('type')?.setFilterValue(value)}
              />
            </form>
          </Form>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.columnDef.header;
                return (
                  <TableHead key={header.id} onClick={() => isSortable && toggleSortOrder(header.column.id)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && (
                      <span>{sortColumn === header.column.id && (sortOrder === 'asc' ? ' ↓' : ' ↑')}</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer"
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                // onClick={() => push(`/clients/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={cell.id}>
                    <TableCell
                      // click na linha para enviar para view do client, mas não
                      // se aplica nas
                      onClick={
                        [2, 3, 4].includes(cell.column.getIndex())
                          ? () => {}
                          : () => push(`/clients/${row.original.id}`)
                      }
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

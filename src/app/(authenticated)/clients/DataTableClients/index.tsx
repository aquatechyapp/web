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
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ClientData {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  // outras propriedades do cliente
}

interface DataTableProps {
  columns: ColumnDef<ClientData, keyof ClientData>[];
  data: ClientData[];
}

export function DataTableClients<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { push } = useRouter();

  const toggleSortOrder = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
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
    },
    filterFns: {
      deactivatedAt: (row, value, filter) => {
        if (filter === 'active') {
          return row.original.isActive;
        }
        if (filter === 'inactive') {
          return !row.original.isActive;
        }
        return true;
      }
    }
  });

  // Defina as opções para o SelectField
  const selectOptions = [
    { value: 'all', name: 'All clients' },
    { value: 'active', name: 'Active' },
    { value: 'inactive', name: 'Inactive' }
  ];

  // Use o useForm para gerenciar o estado dos campos do formulário
  const form = useForm({
    defaultValues: {
      filter: 'all'
    }
  });

  const formCity = useForm({
    defaultValues: {
      city: 'all' // Valor padrão para a cidade
    }
  });

  const formType = useForm({
    defaultValues: {
      type: 'all' // Valor padrão para a cidade
    }
  });

  // Obtendo uma lista de cidades únicas dos dados dos clientes
  const cities = Array.from(new Set(sortedData.map((client) => client.city)));
  // Definindo opções para o SelectField da cidade
  const citySelectOptions = [
    { value: null, name: 'All cities' },
    ...cities.map((city) => ({ value: city, name: city }))
  ];

  const types = Array.from(new Set(sortedData.map((client) => client.type)));
  const typesSelectOptions = [
    { value: null, name: 'All types' },
    ...types.map((type) => ({ value: type, name: type }))
  ];

  return (
    <div className="rounded-md border">
      <div className="flex w-full flex-col items-center justify-between px-2 py-4 md:flex-row">
        <div className="flex w-full text-nowrap">
          <Button>
            <PlusIcon className="mr-2" />
            <Link href={'/clients/new'}>New Client</Link>
          </Button>
          <Input
            placeholder="Filter clients..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className="ml-4 max-w-sm"
          />
        </div>
        <div className="flex w-full">
          <Form {...form}>
            <form className="mb-2 flex w-full gap-4">
              <SelectField
                form={form}
                name="Filter"
                data={selectOptions}
                placeholder="Status"
                onValueChange={(value) => table.getColumn('deactivatedAt')?.setFilterValue(value)}
              />
              <SelectField
                form={formCity}
                name="City"
                data={citySelectOptions}
                placeholder="City"
                onValueChange={(value) => table.getColumn('city')?.setFilterValue(value)}
              />
              <SelectField
                form={formType}
                name="Type"
                data={typesSelectOptions}
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
                        [2, 3].includes(cell.column.getIndex()) ? () => {} : () => push(`/clients/${row.original.id}`)
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
    </div>
  );
}

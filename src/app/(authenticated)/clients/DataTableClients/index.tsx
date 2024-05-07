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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClientData {
  id: string;
  name: string;
  address: string;
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

  const { push } = useRouter();

  return (
    <div className="rounded-md border">
      <div className="flex w-full items-center justify-between px-2 py-4">
        <div className="flex w-full">
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
        <div>
          <Tabs defaultValue="all" onValueChange={(value) => table.getColumn('deactivatedAt')?.setFilterValue(value)}>
            <TabsList defaultValue="all">
              <TabsTrigger className="text-nowrap" value="all">
                All clients
              </TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">inactive</TabsTrigger>
            </TabsList>
          </Tabs>
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

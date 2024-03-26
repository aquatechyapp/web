'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  createColumnHelper
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/_components/ui/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/app/_components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { Button } from '@/app/_components/ui/button';
import Link from 'next/link';
import { PlusIcon } from '@radix-ui/react-icons';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableClients<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filter, setFilter] = useState('all');
  const table = useReactTable({
    data,
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
      <div className="flex items-center py-4 w-full justify-between px-2">
        <div className="flex w-full">
          <Button>
            <PlusIcon className="mr-2" />
            <Link href={'/clients/new'}>New Client</Link>
          </Button>
          <Input
            placeholder="Filter clients..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm ml-4"
          />
        </div>
        <div>
          <Tabs
            defaultValue="all"
            onValueChange={(value) =>
              table.getColumn('deactivatedAt')?.setFilterValue(value)
            }
          >
            <TabsList defaultValue="all">
              <TabsTrigger value="all">All clients</TabsTrigger>
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
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, b) => (
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
                      [2, 3].includes(cell.column.getIndex())
                        ? () => {}
                        : () => push(`/clients/${row.original.id}`)
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

'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';

import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Categories, RequestStatus } from '@/constants';
import { buildSelectOptions } from '@/utils/formUtils';

import { FilterSelect } from './FilterSelect';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableRequests<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    }
  });

  return (
    <>
      <div className="mx-2 my-4 flex flex-wrap gap-4 md:flex-nowrap">
        <Input
          className="w-auto"
          placeholder="Filter clients..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        />
        <FilterSelect
          data={RequestStatus}
          value={table.getColumn('status')?.getFilterValue() as string}
          onChange={(value) => {
            table.getColumn('status')?.setFilterValue(value === 'All' ? '' : value);
          }}
          placeholder="Status"
        />
        <FilterSelect
          data={buildSelectOptions(Categories, { key: 'value', name: 'name', value: 'value' })}
          value={table.getColumn('category')?.getFilterValue() as string}
          onChange={(value) => {
            table.getColumn('category')?.setFilterValue(value === 'All' ? '' : value);
          }}
          placeholder="Category"
        />
        <DatePicker
          placeholder="From"
          onChange={(value) => {
            table.getColumn('createdAt')?.setFilterValue((old: [d1: Date, d2: Date]) => {
              if (!old) return [value, null];
              return [value, old[1]];
            });
          }}
        />
        <DatePicker
          placeholder="To"
          onChange={(value) =>
            table.getColumn('createdAt')?.setFilterValue((old: [d1: Date, d2: Date]) => {
              if (!old) return [null, value];
              return [old[0], value];
            })
          }
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="cursor-pointer" key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

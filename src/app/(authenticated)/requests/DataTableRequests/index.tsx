'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useState } from 'react';

import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Categories, RequestStatus } from '@/constants';
import { Request } from '@/ts/interfaces/Request';

import { ModalAddRequest } from '../ModalAddRequest';
import { ModalEditRequest } from '../ModalEditRequest';
import { FilterSelect } from './FilterSelect';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableRequests<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState(false);

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
    <div className="flex flex-col gap-6 p-2">
      <div className="mb-2 flex w-full flex-col flex-wrap gap-4 text-nowrap md:flex-nowrap lg:mb-0 lg:flex-row [&>*]:flex-1">
        <ModalAddRequest />
        <Input
          className="min-w-50"
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
          data={Categories}
          value={table.getColumn('category')?.getFilterValue() as string}
          onChange={(value) => {
            table.getColumn('category')?.setFilterValue(value === 'All' ? '' : value);
          }}
          placeholder="Category"
        />
        <DatePicker
          placeholder="Created From"
          onChange={(value) => {
            table.getColumn('createdAt')?.setFilterValue((old: [d1: Date, d2: Date]) => {
              if (!old) return [value, null];
              return [value, old[1]];
            });
          }}
        />
        <DatePicker
          placeholder="Created To"
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
            table.getRowModel().rows.map((row) => {
              return (
                <React.Fragment key={row.id}>
                  <ModalEditRequest request={row.original as Request} open={open} setOpen={setOpen} />
                  <TableRow
                    onClick={() => setOpen(true)}
                    className="cursor-pointer"
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              );
            })
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

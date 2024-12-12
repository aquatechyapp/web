import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Request } from '@/ts/interfaces/Request';

import { ModalEditRequest } from '../ModalEditRequest';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children: any;
}

export function DataTableRequests<TData, TValue>({ columns, data, children }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters);
    },
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
        {children}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => setSelectedRequest(row.original as Request)}
                className="cursor-pointer"
                data-state={row.getIsSelected() && 'selected'}
              >
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

      {/* Modal fora do loop */}
      {selectedRequest && (
        <ModalEditRequest request={selectedRequest} open={!!selectedRequest} setOpen={() => setSelectedRequest(null)} />
      )}
    </div>
  );
}
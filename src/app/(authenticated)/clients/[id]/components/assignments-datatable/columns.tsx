'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { zipImages } from '@/lib/js-zip';

import CellDeleteService from './remove-dialog';
import { Assignment } from '@/ts/interfaces/Assignments';
import { User } from '@/ts/interfaces/User';
import AssignmentsDatatableActions from './actions';

export type PoolAssignmentsPopulated = Assignment & {
  assignmentToUser: User;
};

export const columns: ColumnDef<PoolAssignmentsPopulated>[] = [
  {
    accessorKey: 'startOn',
    header: 'Start on',
    cell: (props) => {
      const formattedDate = format(new Date(props.row.original.createdAt), 'MM/dd/yyyy');
      return <span className="text-nowrap">{formattedDate}</span>;
    }
  },
  {
    accessorKey: 'endafter',
    header: 'End after',
    cell: (props) => {
      return <span className="text-nowrap">{format(new Date(props.row.original.endAfter), 'MM/dd/yyyy')}</span>;
    }
  },
  {
    accessorKey: 'assignmentToUser.fullname',
    header: 'Assigned to',
    cell: (props) => {
      const fullname = `${props.row.original.assignmentToUser.firstName} ${props.row.original.assignmentToUser.lastName}`;
      return <span className="text-nowrap">{fullname}</span>;
    }
  },
  {
    accessorKey: 'weekday',
    header: 'Weekday',
    cell: (props) => {
      return <span className="text-nowrap">{props.row.original.weekday}</span>;
    }
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency',
    cell: (props) => {
      return <span className="text-nowrap">{props.row.original.frequency}</span>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (props) => {
      return <span className="text-nowrap">{props.row.original.status}</span>;
    }
  },
  {
    id: 'actions',
    cell: (props) => <AssignmentsDatatableActions data={props.row.original} />
  }
];

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { zipImages } from '@/lib/js-zip';

import CellDeleteService from './remove-dialog';
import { Assignment } from '@/ts/interfaces/Assignments';
import AssignmentsDatatableActions from './actions';

export type PoolAssignmentsPopulated = Assignment;

export const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: 'startOn',
    header: 'Start on',
    cell: (props) => {
      const formattedDate = format(new Date(props.row.original.startOn), 'MM/dd/yyyy');
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
    accessorKey: 'assignmentTo',
    header: 'Assigned to',
    cell: (props) => {
      const assignmentTo = props.row.original.assignmentTo;
      if (assignmentTo) {
        return <span className="text-nowrap">{assignmentTo.firstName} {assignmentTo.lastName}</span>;
      }
      return <span className="text-nowrap">{props.row.original.assignmentToId}</span>;
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
      const frequency = props.row.original.frequency;
      const frequencyMap = {
        WEEKLY: 'Weekly',
        E2WEEKS: 'Each 2 weeks',
        E3WEEKS: 'Each 3 weeks',
        E4WEEKS: 'Each 4 weeks',
        ONCE: 'Once'
      };
      return <span className="text-nowrap">{frequencyMap[frequency as keyof typeof frequencyMap]}</span>;
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

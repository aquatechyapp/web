'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Assignment, Pool, Service } from '@/constants/interfaces';
import { clientAxios } from '@/services/clientAxios';

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: (props) => (
      <span>
        {format(new Date(props.row.original.createdAt), 'MMMM, dd, yyyy')}
      </span>
    )
  },
  {
    header: 'Chemicals read',
    cell: (props) => {
      const { ph, chlorine, salt, alkalinity, cyanAcid } = props.row.original;
      return (
        <div>
          <div>
            <span>
              PH {ph} - Chlorine {chlorine}
            </span>
          </div>
          <div>
            <span>
              Salt {salt} - Alkalinity {alkalinity}
            </span>
          </div>
          <span>Cyan Acid {cyanAcid}</span>
        </div>
      );
    }
  },
  {
    accessorKey: '',
    header: 'Photos',
    cell: (props) => <span>Download photos</span>
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: (props) => {
      async function handleDelete() {
        try {
          const res = await clientAxios.delete('/services', {
            data: {
              id: props.row.original.id
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
      return (
        <Button variant="destructive" size="sm" onClick={() => {}}>
          <FaRegTrashAlt />
        </Button>
      );
    }
  }
];

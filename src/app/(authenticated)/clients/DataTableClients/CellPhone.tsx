import { CellContext } from '@tanstack/react-table';

import { Client } from '@/interfaces/Client';

export default function Phones(cell: CellContext<Client, unknown>) {
  const { phone } = cell.row.original;
  return (
    <div className="flex flex-col">
      <span>Primary {phone}</span>
    </div>
  );
}

import { CellContext } from '@tanstack/react-table';

import { Client } from '@/interfaces/Client';

export default function Phones(cell: CellContext<Client, unknown>) {
  const { phone1 } = cell.row.original;
  return (
    <div className="flex flex-col">
      <span>Primary {phone1}</span>
      {/* <span>Secondary {phone2}</span> */}
    </div>
  );
}

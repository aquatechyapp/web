import { format } from 'date-fns';
import { useState } from 'react';

import { Request } from '@/ts/interfaces/Request';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ModalEditRequest } from '@/app/(authenticated)/requests/ModalEditRequest';

interface RequestsTabProps {
  requests: Request[];
  poolId: string;
  clientId: string;
}

export default function RequestsTab({ requests, poolId, clientId }: RequestsTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [open, setOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleRowClick = (request: Request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  return (
    <>
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px] flex-1">Date</TableHead>
            <TableHead className="min-w-[100px] flex-1">Description</TableHead>
            <TableHead className="min-w-[100px] flex-1">Status</TableHead>
            <TableHead className="min-w-[100px] flex-1">Outcome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <TableRow
                key={request.id}
                className="cursor-pointer hover:bg-slate-100/50"
                onClick={() => handleRowClick(request)}
              >
                <TableCell className="min-w-[100px] flex-1 text-slate-500">
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell className="min-w-[100px] flex-1 text-slate-500">
                  <div className="max-w-xs truncate" title={request.description}>
                    {request.description}
                  </div>
                </TableCell>
                <TableCell className="min-w-[100px] flex-1 text-slate-500">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell className="min-w-[100px] flex-1 text-slate-500">
                  <div className="max-w-xs truncate" title={request.outcome || ''}>
                    {request.outcome || '-'}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {selectedRequest && (
      <ModalEditRequest 
        request={selectedRequest} 
        open={open} 
        setOpen={setOpen} 
      />
    )}
    </>
  );
}

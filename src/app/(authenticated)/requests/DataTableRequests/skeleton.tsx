import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function DataTableRequestsSkeleton() {
  return (
    <div className="w-full rounded-md">
      <div className="relative w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

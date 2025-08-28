import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface PaginationDemoProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationDemo({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationDemoProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  return (
    <div className="flex items-center justify-center space-x-6 py-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newPage = Math.max(1, Number(currentPage) - 1);
          onPageChange(newPage);
        }}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newPage = Math.min(totalPages, Number(currentPage) + 1);
          onPageChange(newPage);
        }}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}

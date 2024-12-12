import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

type PaginationDemoProps = {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function PaginationDemo({ currentPage, totalItems, onPageChange }: PaginationDemoProps) {
  // Calcular se há mais itens para exibir
  const itemsPerPage = 19;
  const hasNextPage = totalItems > currentPage * itemsPerPage;

  return (
    <div className="flex items-center justify-between">
      <p className="w-[85%] text-sm text-gray-500">
        Showing {currentPage}
        {totalItems > currentPage * 19 && ` from ${currentPage + 1}`}
      </p>
      <Pagination className="w-auto">
        <PaginationContent className="flex items-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
            ></PaginationPrevious>
          </PaginationItem>

          <PaginationItem key={currentPage}>
            <PaginationLink isActive className="bg-blue-500 text-white">
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className={`${!hasNextPage ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
            ></PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

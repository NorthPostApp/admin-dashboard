import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";

type PaginationBarProps = {
  totalPages: number;
  currPage: number;
  hasMore: boolean;
  loading: boolean;
  selectPageAction: (page: number) => void;
};

export default function PaginationBar({
  totalPages,
  currPage,
  hasMore,
  loading,
  selectPageAction,
}: PaginationBarProps) {
  const prevDisabled = currPage <= 1;
  const nextDisabled = currPage >= totalPages ? !hasMore : false;
  return (
    <Pagination className="py-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            data-testid="pagination-previous"
            disabled={prevDisabled || loading}
            onClick={() => !prevDisabled && !loading && selectPageAction(currPage - 1)}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem
            key={`address-pagination-${page}`}
            onClick={() => selectPageAction(page)}
          >
            <PaginationLink isActive={page === currPage}>{page}</PaginationLink>
          </PaginationItem>
        ))}
        {hasMore && (
          <PaginationItem>
            <PaginationEllipsis data-testid="pagination-ellipsis" />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            data-testid="pagination-next"
            disabled={nextDisabled || loading}
            onClick={() => !nextDisabled && !loading && selectPageAction(currPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

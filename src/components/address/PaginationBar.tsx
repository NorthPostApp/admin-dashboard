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
  selectPageAction: (page: number) => void;
};

export default function PaginationBar({
  totalPages,
  currPage,
  hasMore,
  selectPageAction,
}: PaginationBarProps) {
  return (
    <Pagination className="py-3">
      <PaginationContent>
        <PaginationItem onClick={() => selectPageAction(currPage - 1)} className="">
          <PaginationPrevious disabled={currPage === 1} />
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
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem onClick={() => selectPageAction(currPage + 1)}>
          <PaginationNext disabled={currPage === totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

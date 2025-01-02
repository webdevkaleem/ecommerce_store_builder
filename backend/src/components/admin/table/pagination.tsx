import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateQueryString from "@/hooks/use-create-query-string";
import useRemoveQueryString from "@/hooks/use-remove-query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { checkCollection } from "@/lib/helper-functions";
import { type CollectionsType } from "@/lib/const";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  maxPages: number;
  maxRows: number;
  collection: CollectionsType;
}

export function DataTablePagination<TData>({
  table,
  maxPages,
  maxRows,
  collection,
}: DataTablePaginationProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useCreateQueryString(searchParams);
  const { removeQueryString } = useRemoveQueryString(searchParams);

  const currentPage = Number(searchParams.get("page") ?? 1);
  const canNextPage = currentPage < maxPages;
  const canPreviousPage = currentPage > 1;

  // Render
  return (
    <div className="flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
      <div
        className={cn("flex-1 text-sm text-muted-foreground", {
          "select-none opacity-0": !checkCollection({
            pathname,
            collectionCheck: collection.plural,
          }),
        })}
      >
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row (s) selected.
        <br />
        Total row (s): {maxRows}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={
              searchParams.get("pageSize") ??
              String(table.getState().pagination.pageSize)
            }
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              table.resetRowSelection();
              if (value === "10") {
                return router.push(
                  pathname + "?" + removeQueryString(["pageSize"]),
                  { scroll: false },
                );
              }

              router.push(
                pathname + "?" + createQueryString("pageSize", String(value)),
                { scroll: false },
              );
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-5 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {maxPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => {
                router.push(pathname + "?" + createQueryString("page", "1"));

                table.resetRowSelection();
              }}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                router.push(
                  pathname +
                    "?" +
                    createQueryString("page", String(currentPage - 1)),
                );
                table.resetRowSelection();
              }}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                router.push(
                  pathname +
                    "?" +
                    createQueryString("page", String(currentPage + 1)),
                );
                table.resetRowSelection();
              }}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => {
                router.push(
                  pathname + "?" + createQueryString("page", String(maxPages)),
                );
                table.resetRowSelection();
              }}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

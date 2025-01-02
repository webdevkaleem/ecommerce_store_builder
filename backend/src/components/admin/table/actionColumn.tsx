// Global Imports
"use client";

import { type Row, type Table } from "@tanstack/react-table";
import { ArrowRightFromLine, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";

// Local Imports
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkCollection } from "@/lib/helper-functions";
import { cn } from "@/lib/utils";
import {
  type selectCategory,
  type selectSubCategory,
} from "@/server/db/schema";
import { useDeleteCategoryStore } from "@/store/admin/delete-category";
import { useDeleteSubCategoryStore } from "@/store/admin/delete-sub-category";
import { usePathname } from "next/navigation";
import { type z } from "zod";

// Body
// Types
type ActionsType = {
  collection: { singular: string; plural: string };
} & (
  | {
      name: "Category";
      table: Table<z.infer<typeof selectCategory>>;
      row?: Row<z.infer<typeof selectCategory>>;
    }
  | {
      name: "Sub Category";
      table: Table<z.infer<typeof selectSubCategory>>;
      row?: Row<z.infer<typeof selectSubCategory>>;
    }
);

export function ActionsHeader({ table, collection }: ActionsType) {
  // States / Hooks
  const pathname = usePathname();
  const { setCategories } = useDeleteCategoryStore();
  const { setSubCategories } = useDeleteSubCategoryStore();

  // If the tables is being rendered as a child on another page then do not render the actions
  if (!checkCollection({ pathname, collectionCheck: collection.plural })) {
    return null;
  }

  // Initialize Variables
  const allIds = table.getFilteredSelectedRowModel().rows.map((row) => {
    return Number(row.getValue("id"));
  });

  // Render
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={table.getFilteredSelectedRowModel().rows.length === 0}
      >
        <Button variant="ghost" className="relative h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />

          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div
              className={cn(
                "absolute -right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground",
                {
                  "h-5 w-5":
                    table.getFilteredSelectedRowModel().rows.length >= 10,
                },
              )}
            >
              {table.getFilteredSelectedRowModel().rows.length}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          onClick={() => {
            table.resetRowSelection(true);

            // Conditional selection of the right store
            if (collection.singular === "Category") {
              return setCategories([...allIds]);
            } else if (collection.singular === "Sub Category") {
              return setSubCategories([...allIds]);
            }
          }}
        >
          <Trash />
          <span>Remove all files</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowRightFromLine />
          <span>Export selected as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ActionsCell({ row, table, collection }: ActionsType) {
  // States / Hooks
  const pathname = usePathname();
  const { setCategories } = useDeleteCategoryStore();
  const { setSubCategories } = useDeleteSubCategoryStore();

  // Initialize Variables
  if (!row) return null;

  const currentRow = row.original;

  // If the tables is being rendered as a child on another page then do not render the actions
  if (!checkCollection({ pathname, collectionCheck: collection.plural })) {
    return null;
  }

  // Render
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Copy URL</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href={pathname + "/" + currentRow.id + "/edit"} scroll={false}>
          <DropdownMenuItem>Edit {collection.singular}</DropdownMenuItem>
        </Link>

        {/* Setting the delete category state on click */}
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          onClick={() => {
            table.resetRowSelection(true);

            // Conditional selection of the right store
            if (collection.singular === "Category") {
              return setCategories([currentRow.id]);
            } else if (collection.singular === "Sub Category") {
              return setSubCategories([currentRow.id]);
            }
          }}
        >
          Remove {collection.singular}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

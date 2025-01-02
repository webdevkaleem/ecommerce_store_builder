"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { checkCollection } from "@/lib/helper-functions";
import type { selectCategory, selectSubCategory } from "@/server/db/schema";
import { useCreateSubCategoryStore } from "@/store/admin/create-sub-category";
import { type Row, type Table } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { type z } from "zod";

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

export function IdHeader({ table, collection }: ActionsType) {
  // States / Hooks
  const pathname = usePathname();

  // If the tables is being rendered as a child on another page then render <SelectItem/>
  if (!checkCollection({ pathname, collectionCheck: collection.plural })) {
    return null;
  }
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

export function IdCell({ row, table, collection }: ActionsType) {
  // States / Hooks
  const pathname = usePathname();
  const { setCategoryName, categoryName, toggleShow } =
    useCreateSubCategoryStore();

  if (!row) return null;

  // If the tables is being rendered as a child on another page
  // If it is then we render custom logic of selecting the row and putting the id in the search params
  if (!checkCollection({ pathname, collectionCheck: collection.plural })) {
    return (
      <Checkbox
        checked={categoryName === String(row.original.name) ? true : false}
        onCheckedChange={(value) => {
          table.resetRowSelection();
          row.toggleSelected(!!value);

          toggleShow();

          if (categoryName === String(row.original.name)) {
            setCategoryName(undefined);
          }

          return setCategoryName(String(row.original.name));
        }}
        aria-label="Select row"
      />
    );
  }

  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}
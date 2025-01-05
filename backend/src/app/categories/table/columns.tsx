"use client";

import { slugToLabel } from "@/lib/helper-functions";
import { type selectCategory } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { IdCell, IdHeader } from "@/components/admin/table/idColumn";
import {
  ActionsCell,
  ActionsHeader,
} from "../../../components/admin/table/actionColumn";
import { type z } from "zod";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<z.infer<typeof selectCategory>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IdHeader
        name="Category"
        table={table}
        collection={{ singular: "Category", plural: "Categories" }}
      />
    ),
    cell: ({ row, table }) => (
      <IdCell
        name="Category"
        collection={{ singular: "Category", plural: "Categories" }}
        row={row}
        table={table}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "id", header: "ID", enableHiding: false },
  {
    accessorKey: "name",
    header: () => {
      return <div className="line-clamp-1 truncate">Name</div>;
    },
    cell: ({ row }) => {
      return (
        <div className={cn("line-clamp-1")}>
          {slugToLabel(row.getValue("name"))}
        </div>
      );
    },
  },
  {
    accessorKey: "visibility",
    header: () => {
      return <div className="line-clamp-1 truncate">Visibility</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 truncate">
          {slugToLabel(row.getValue("visibility"))}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div
          className="line-clamp-1 flex cursor-pointer select-none items-center gap-2 truncate"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const f = new Intl.DateTimeFormat("en-us", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      return (
        <div className="line-clamp-1 truncate">
          {f.format(row.getValue("updatedAt"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => (
      <ActionsHeader
        name="Category"
        table={table}
        collection={{ singular: "Category", plural: "Categories" }}
      />
    ),
    cell: ({ row, table }) => (
      <ActionsCell
        name="Category"
        row={row}
        table={table}
        collection={{ singular: "Category", plural: "Categories" }}
      />
    ),
  },
];

"use client";

import { slugToLabel } from "@/lib/helper-functions";
import { type selectSubCategory } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import {
  ActionsCell,
  ActionsHeader,
} from "../../../components/admin/table/actionColumn";
import { IdCell, IdHeader } from "@/components/admin/table/idColumn";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { type z } from "zod";

const collection = { singular: "Sub Category", plural: "Sub Categories" };

export const columns: ColumnDef<z.infer<typeof selectSubCategory>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IdHeader table={table} name="Sub Category" collection={collection} />
    ),
    cell: ({ row, table }) => (
      <IdCell
        collection={collection}
        row={row}
        table={table}
        name="Sub Category"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "id", header: "ID", enableHiding: false },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div>{slugToLabel(row.getValue("name"))}</div>;
    },
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Link href={"/categories/" + String(row.getValue("categoryId"))}>
          <Badge variant="outline">Category</Badge>
        </Link>
      );
    },
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => {
      return <div>{slugToLabel(row.getValue("visibility"))}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer select-none items-center gap-2"
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

      return <div>{f.format(row.getValue("updatedAt"))}</div>;
    },
  },

  {
    id: "actions",
    header: ({ table }) => (
      <ActionsHeader
        table={table}
        name="Sub Category"
        collection={collection}
      />
    ),
    cell: ({ row, table }) => (
      <ActionsCell
        row={row}
        table={table}
        name="Sub Category"
        collection={collection}
      />
    ),
  },
];

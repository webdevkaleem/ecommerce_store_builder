import { type selectCategory } from "@/server/db/schema";
import { columns } from "./columns";
import { DataTable } from "@/components/admin/table/data-table";
import { type CollectionsType } from "@/lib/const";
import { type z } from "zod";

export default function CategoriesTable({
  data,
  maxPages,
  maxRows,
  collection,
}: {
  data: z.infer<typeof selectCategory>[];
  maxPages: number;
  maxRows: number;
  collection: CollectionsType;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      maxPages={maxPages}
      maxRows={maxRows}
      collection={collection}
    />
  );
}

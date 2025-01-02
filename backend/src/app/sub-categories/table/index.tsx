import { type selectSubCategory } from "@/server/db/schema";
import { columns } from "./columns";
import { DataTable } from "@/components/admin/table/data-table";
import { type CollectionsType } from "@/lib/const";
import { type z } from "zod";

export default async function SubCategoriesTable({
  data,
  maxPages,
  maxRows,
  collection,
}: {
  data: z.infer<typeof selectSubCategory>[];
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

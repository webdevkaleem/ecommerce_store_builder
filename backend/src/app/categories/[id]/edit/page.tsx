import { type ParamsId } from "@/lib/helper-functions";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default function Page({ params }: { params: ParamsId }) {
  return <DataWrapper params={params} />;
}

async function DataWrapper({ params }: { params: ParamsId }) {
  const { id } = await params;

  if (!id) {
    redirect("/categories");
  }

  const { data: categorySelected } = await api.category.byId({
    id: Number(id),
  });

  if (!categorySelected) {
    redirect("/categories");
  }

  return <h1>{categorySelected.name}</h1>;
}

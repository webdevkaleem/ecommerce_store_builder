import { slugToLabel, type ParamsId } from "@/lib/helper-functions";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import EditForm from "./form";

export default function Page({ params }: { params: ParamsId }) {
  return <DataWrapper params={params} />;
}

async function DataWrapper({ params }: { params: ParamsId }) {
  const { id } = await params;

  // Consts
  const backUrl = "/categories";

  if (!id) {
    redirect(backUrl);
  }

  const { data: categorySelected } = await api.category.byId({
    id: Number(id),
  });

  if (!categorySelected) {
    redirect(backUrl);
  }

  return (
    <EditForm
      id={categorySelected.id}
      createdAt={categorySelected.createdAt}
      updatedAt={categorySelected.updatedAt}
      name={slugToLabel(categorySelected.name)}
      visibility={categorySelected.visibility}
    />
  );
}

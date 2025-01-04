import { Suspense } from "react";
import FadeIn from "@/components/admin/animations/fade-in";
import Loader from "@/components/admin/animations/loader";
import EditForm from "./form";
import {
  type SearchParamsType,
  slugToLabel,
  type ParamsId,
} from "@/lib/helper-functions";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default function Page({
  params,
  searchParams,
}: {
  params: ParamsId;
  searchParams: SearchParamsType;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <FadeIn>
        <DataWrapper params={params} searchParams={searchParams} />
      </FadeIn>
    </Suspense>
  );
}

async function DataWrapper({
  params,
  searchParams,
}: {
  params: ParamsId;
  searchParams: SearchParamsType;
}) {
  const {
    page = "1",
    pageSize = "10",
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = await searchParams;
  const { id } = await params;

  // Consts
  const backUrl = "/sub-categories";

  if (!id) {
    redirect(backUrl);
  }

  const { data: subCategorySelected } = await api.subCategory.byId({
    id: Number(id),
  });

  const { data, maxPages, maxRows } = await api.category.all({
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  if (!subCategorySelected) {
    redirect(backUrl);
  }

  return (
    <EditForm
      allCategories={data ?? []}
      maxPages={maxPages ?? 0}
      maxRows={maxRows ?? 0}
      subCategory={{
        categoryId: subCategorySelected.categoryId.id,
        categoryName: subCategorySelected.categoryId.name,
        id: subCategorySelected.id,
        name: slugToLabel(subCategorySelected.name),
        visibility: subCategorySelected.visibility,
        createdAt: subCategorySelected.createdAt,
        updatedAt: subCategorySelected.updatedAt,
      }}
    />
  );
}

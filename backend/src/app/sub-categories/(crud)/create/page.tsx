// Global Imports
// Local Imports

import { api } from "@/trpc/server";
import CreateForm from "./form";
import { type SearchParamsType } from "@/lib/helper-functions";
import { Suspense } from "react";
import FadeIn from "@/components/admin/animations/fade-in";
import Loader from "@/components/admin/animations/loader";

// Body

export default function Page({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <FadeIn>
          <CategoryTableWrapper searchParams={searchParams} />
        </FadeIn>
      </Suspense>
    </>
  );
}

async function CategoryTableWrapper({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const {
    page = "1",
    pageSize = "10",
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = await searchParams;

  const { data, maxPages, maxRows } = await api.category.all({
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  return (
    <CreateForm
      allCategories={data ?? []}
      maxPages={maxPages ?? 0}
      maxRows={maxRows ?? 0}
    />
  );
}

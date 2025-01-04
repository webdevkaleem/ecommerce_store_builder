import FadeIn from "@/components/admin/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import SubCategoriesTable from "./table";
import Loader from "@/components/admin/animations/loader";
import DeleteAllModel from "@/components/admin/models/sub-category/delete-all";
import DeleteByIdModel from "@/components/admin/models/sub-category/delete-by-id";
import { type CollectionsType } from "@/lib/const";
import { type SearchParamsType } from "@/lib/helper-functions";

const collection: CollectionsType = {
  singular: "Sub Category",
  plural: "Sub Categories",
};

export default function Page({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  return (
    <>
      {/* Main Section */}
      <Suspense fallback={<Loader />}>
        <FadeIn>
          <HeroSection />
        </FadeIn>
        <FadeIn>
          <Separator />
        </FadeIn>
        <FadeIn>
          <SearchTable searchParams={searchParams} />
        </FadeIn>

        {/* Models */}
        <DeleteAllModel collection={collection} />
        <DeleteByIdModel collection={collection} />
      </Suspense>
    </>
  );
}

function HeroSection() {
  return (
    <div className="flex flex-col gap-6">
      <h1>Sub Categories</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, atque?
        Quam iusto minus sed, a cumque rerum asperiores ex aut?
      </p>
      <Button className="w-fit" asChild>
        <Link href={"./sub-categories/create"}>
          <Plus />
          <span>Create</span>
        </Link>
      </Button>
    </div>
  );
}

async function SearchTable({
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

  const allCategories = await api.subCategory.all({
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  return (
    <div className="flex flex-col gap-4">
      <SubCategoriesTable
        data={allCategories.data}
        maxPages={allCategories.maxPages}
        maxRows={allCategories.maxRows}
        collection={collection}
      />
    </div>
  );
}

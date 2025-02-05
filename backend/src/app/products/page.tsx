import FadeIn from "@/components/admin/animations/fade-in";
import Loader from "@/components/admin/animations/loader";
import DeleteAllModel from "@/components/admin/models/category/delete-all";
import DeleteByIdModel from "@/components/admin/models/category/delete-by-id";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type CollectionsType } from "@/lib/const";
import { labelToSlug } from "@/lib/helper-functions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const collection: CollectionsType = {
  singular: "Product",
  plural: "Products",
};

export default function Page() {
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
      <h1>Products</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, atque?
        Quam iusto minus sed, a cumque rerum asperiores ex aut?
      </p>
      <Button className="w-fit" asChild>
        <Link href={`./${labelToSlug(collection.plural)}/create`}>
          <Plus />
          <span>Create</span>
        </Link>
      </Button>
    </div>
  );
}

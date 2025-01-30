import FadeIn from "@/components/admin/animations/fade-in";
import Loader from "@/components/admin/animations/loader";
import { type CollectionsType } from "@/lib/const";
import { Suspense } from "react";
import CreateForm from "./form";

const collection: CollectionsType = {
  singular: "Media",
  plural: "Media",
};

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <FadeIn>
        <CreateForm collection={collection} />
      </FadeIn>
    </Suspense>
  );
}

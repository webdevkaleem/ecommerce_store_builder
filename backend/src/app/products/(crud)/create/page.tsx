import { Suspense } from "react";
import CreateForm from "./form";
import FadeIn from "@/components/admin/animations/fade-in";
import Loader from "@/components/admin/animations/loader";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <FadeIn>
        <CreateForm />
      </FadeIn>
    </Suspense>
  );
}

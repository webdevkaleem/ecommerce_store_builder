"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpFromLine, LoaderCircle, X } from "lucide-react";
import FormLoadingOverlay from "./form-loading-overlay";

export default function TopButtons({
  pushChangesLoading = false,
}: {
  pushChangesLoading?: boolean;
}) {
  return (
    <>
      <div className="flex gap-3">
        <Button variant={"destructive"} type="reset">
          <X />
          <span>Discard</span>
        </Button>
        <Button type="submit" disabled={pushChangesLoading}>
          <div className="flex items-center gap-2">
            {pushChangesLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <ArrowUpFromLine />
            )}
            <span>Push Changes</span>
          </div>
        </Button>
      </div>

      {/* Loading overlay which is animated */}
      {pushChangesLoading && <FormLoadingOverlay />}
    </>
  );
}

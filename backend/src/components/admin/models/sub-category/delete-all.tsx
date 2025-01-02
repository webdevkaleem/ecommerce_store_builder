"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { type CollectionsType } from "@/lib/const";
import { useDeleteSubCategoryStore } from "@/store/admin/delete-sub-category";
import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function DeleteAllModel({
  collection,
}: {
  collection: CollectionsType;
}) {
  // State & Hooks
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const { subCategories, resetSubCategories, many } =
    useDeleteSubCategoryStore();

  //   Use memo to prevent re-renders
  const allIds = useMemo(() => {
    return subCategories;
  }, [subCategories]);

  // Constants
  const showTitle = "Are you absolutely sure?";
  const showDescriptionIntro = `This action cannot be undone. This will permanently delete the selected`;
  const showDescriptionMiddle = ` ${allIds.length} ${collection.singular} `;
  const showDescriptionEnding = `(s) from the database.`;

  // Derived Functions
  const { mutate, data, isSuccess, isPending, reset } =
    api.subCategory.removeAll.useMutation();

  // Functions
  function handleCancel() {
    resetSubCategories();
  }

  function handleContinue() {
    mutate({ ids: allIds });
  }

  // Effects
  useEffect(() => {
    // If the user is deleting sub category (s) then reset the sub categories, show toast and reset the form
    if (isSuccess && allIds.length > 0) {
      // Message
      toast.success(data.message);

      // Refresh
      router.refresh();

      // Reset states
      resetSubCategories();
      reset();
      setOpen(false);
    }

    // If there is an error, then only show a toast
    if (data?.status === "fail") {
      toast.error(data.message);

      // Reset states
      resetSubCategories();
      reset();
    }
  }, [
    allIds,
    pathname,
    data,
    isSuccess,
    reset,
    router,
    collection.plural,
    resetSubCategories,
  ]);

  useEffect(() => {
    // This checks makes sure that the model opens when allIds.length > 0
    if (allIds.length > 0) return setOpen(true);

    return setOpen(false);
  }, [allIds.length]);

  // If only 1 sub category is to be deleted, then hide the component
  if (!many) return null;

  // Render
  if (isMobile) {
    return (
      <Drawer defaultOpen open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{showTitle}</DrawerTitle>
            <DrawerDescription>
              <span>{showDescriptionIntro}</span>
              <span className="font-bold">{showDescriptionMiddle}</span>
              <span>{showDescriptionEnding}</span>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              variant={"destructive"}
              type="button"
              disabled={isPending}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog defaultOpen open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{showTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            <span>{showDescriptionIntro}</span>
            <span className="font-bold">{showDescriptionMiddle}</span>
            <span>{showDescriptionEnding}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant={"destructive"}
            type="button"
            disabled={isPending}
            onClick={handleContinue}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            <span>Continue</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import CategoriesTable from "@/app/categories/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { type selectCategory } from "@/server/db/schema";
import { Edit, Trash2 } from "lucide-react";
import { type z } from "zod";

export default function SelectCategory({
  allCategories,
  maxPages,
  maxRows,
  show,
  toggleShow,
  resetCreateSubCategory,
  label,
}: {
  allCategories: z.infer<typeof selectCategory>[];
  maxPages: number;
  maxRows: number;
  show: boolean;
  toggleShow: () => void;
  resetCreateSubCategory: () => void;
  label: string;
}) {
  const isMobile = useIsMobile();

  return (
    <Sheet open={show} onOpenChange={toggleShow}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <SheetTrigger asChild>
          <div className="flex w-full justify-between gap-4">
            <Button variant={"outline"} className="w-full" type="button">
              {label}
            </Button>

            <Button variant={"outline"} className="" type="button">
              <Edit />
            </Button>
          </div>
        </SheetTrigger>
        <Button
          variant={"destructive_outline"}
          className=""
          type="button"
          onClick={resetCreateSubCategory}
        >
          <Trash2 />
          {isMobile && <span>Remove</span>}
        </Button>
      </div>
      <SheetContent className="w-screen sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Select a Category</SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-col gap-4">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
                officia nemo repellat dignissimos iure tenetur assumenda neque
                blanditiis earum laudantium?
              </p>
              <Separator />
              <div className="flex flex-col gap-4">
                <CategoriesTable
                  data={allCategories}
                  maxPages={maxPages}
                  maxRows={maxRows}
                  collection={{
                    singular: "Category",
                    plural: "Categories",
                  }}
                />
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

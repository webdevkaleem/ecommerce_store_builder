// Global Imports
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpFromLine, Edit, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { type z } from "zod";

// Local Imports

import CategoriesTable from "@/app/categories/table";
import FormLoadingOverlay from "@/components/admin/form/form-loading-overlay";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { slugToLabel } from "@/lib/helper-functions";
import { useCreateSubCategoryStore } from "@/store/admin/create-sub-category";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  insertSubCategory,
  type selectCategory,
  selectVisibilityEnum,
} from "@/server/db/schema";

// Body
export default function CreateForm({
  allCategories,
  maxPages,
  maxRows,
}: {
  allCategories: z.infer<typeof selectCategory>[];
  maxPages: number;
  maxRows: number;
}) {
  // State management
  const [visibility, setVisibility] =
    useState<z.infer<typeof selectVisibilityEnum>>("private");
  const router = useRouter();

  const formRef = useRef(null);
  const {
    categoryName: storeCategoryName,
    resetCreateSubCategory,
    show,
    categoryId: storeCategoryId,
    toggleShow,
  } = useCreateSubCategoryStore();

  // Consts
  const categoryName = storeCategoryName ?? ""; // Default to an empty string if undefined
  const categoryId = storeCategoryId ?? 0; // Default to an empty string if undefined
  const label = slugToLabel(
    categoryName.length > 0 ? categoryName : "Select a Category",
  );

  // Derived Functions
  const { mutate, isPending, isSuccess, data, reset } =
    api.subCategory.create.useMutation();

  // Initialize Form
  const form = useForm<z.infer<typeof insertSubCategory>>({
    resolver: zodResolver(insertSubCategory),
    defaultValues: {
      name: "",
      visibility,
      categoryId: categoryId,
    },
  });

  // Helper Functions
  function onSubmit(values: z.infer<typeof insertSubCategory>) {
    mutate({
      name: values.name,
      visibility: values.visibility,
      categoryId: categoryId,
      categoryName: categoryName,
    });
  }

  function onReset() {
    // Show toast, redirect and reset state
    toast.info("Discarded your changes");

    // Redirect to categories page
    router.push("/sub-categories");

    // Reset state
    resetCreateSubCategory();
    reset();
  }

  async function onSubmitShortcut() {
    const isValid = await form.trigger();

    if (isValid) {
      await form.handleSubmit(onSubmit)();
    }
  }

  // Hotkeys
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useHotkeys("ctrl+enter", () => onSubmitShortcut(), {
    keydown: true,
    enableOnFormTags: true,
  });

  // Effects
  // Setting the categoryName from the store into the form on change
  useEffect(() => {
    form.setValue("categoryId", storeCategoryId ?? 0);
  }, [form, storeCategoryId]);

  useEffect(() => {
    // We check for both to be successful because of rerendering issues
    if (isSuccess) {
      // If push changes (save) is successful then we show a toast and redirect to the categories page
      if (data.status === "success") {
        toast.success(data.message);

        // Redirect to categories page
        router.push("/sub-categories");

        // Clear the state
        resetCreateSubCategory();
        reset();
      } else {
        // If push changes (save) is unsuccessful then we show a toast and we don't redirect
        toast.error(data.message);
      }

      // If push changes (save) is unsuccessful then we show a toast and we don't redirect
    }
  }, [data, isSuccess, reset, resetCreateSubCategory, router]);

  // Render
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-8"
          ref={formRef}
        >
          {/* Hero Section */}
          {/* The props are passed to the hero section to show loading states */}
          <HeroSection pushChangesLoading={isPending} />
          <Separator />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Example Sub Category" {...field} />
                </FormControl>
                <FormDescription>
                  This is the public display name for the sub category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <Select
                      value={visibility}
                      onValueChange={(val) => {
                        setVisibility(
                          val as z.infer<typeof selectVisibilityEnum>,
                        );
                        form.setValue(
                          "visibility",
                          val as z.infer<typeof selectVisibilityEnum>,
                          {
                            shouldValidate: true,
                            shouldTouch: true,
                          },
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectVisibilityEnum.options.map((visibility) => {
                          return (
                            <SelectItem key={visibility} value={visibility}>
                              {slugToLabel(visibility)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is the visbility mode for the sub category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Sheet {...field} open={show} onOpenChange={toggleShow}>
                    <div className="flex justify-between gap-4">
                      <SheetTrigger asChild>
                        <div className="flex w-full justify-between gap-4">
                          <Button
                            variant={"outline"}
                            className="w-full"
                            type="button"
                          >
                            {label}
                          </Button>

                          <Button
                            variant={"outline"}
                            className=""
                            type="button"
                          >
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
                        <X />
                      </Button>
                    </div>
                    <SheetContent className="sm:max-w-4xl">
                      <SheetHeader>
                        <SheetTitle>Select a Category</SheetTitle>
                        <SheetDescription asChild>
                          <div className="flex flex-col gap-4">
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Animi officia nemo repellat dignissimos iure
                              tenetur assumenda neque blanditiis earum
                              laudantium?
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
                </FormControl>
                <FormDescription>
                  This is the category which the sub category will be
                  associated.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

function HeroSection({
  pushChangesLoading = false,
}: {
  pushChangesLoading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
      <h1>Create Sub Category</h1>

      {/* CRUD Buttons */}
      {/* The props are passed to the top buttons to show loading states */}
      <TopButtons pushChangesLoading={pushChangesLoading} />
    </div>
  );
}

function TopButtons({
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

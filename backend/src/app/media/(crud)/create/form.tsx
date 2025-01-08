// Global Imports
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { z } from "zod";

// Local Imports

import TopButtons from "@/components/admin/form/top-buttons";
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
import { Separator } from "@/components/ui/separator";
import { categoryNameSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import Upload from "./upload";

const MediaType = z.object({
  name: z.string(),
  images: z.string().array(),
});

// Body
export default function CreateForm() {
  // State management
  const router = useRouter();
  const formRef = useRef(null);

  // Derived Functions
  const { mutate, isPending, isSuccess, data, reset } =
    api.category.create.useMutation();

  // Initialize Form
  const form = useForm<z.infer<typeof MediaType>>({
    resolver: zodResolver(MediaType),
    defaultValues: {
      name: "",
    },
  });

  // Helper Functions
  function onSubmit(values: z.infer<typeof MediaType>) {
    // 1. Special Checks
    // This checks if the name is valid. This is required as drizzle won't check for stuff like min characters
    const categoryName = categoryNameSchema.safeParse(values.name);

    // If the name is invalid then we show an error message on the form and return
    if (categoryName.error) {
      const errorMessage = categoryName.error.format();
      form.setError("name", { message: errorMessage._errors.join(". ") });
      return;
    }

    // 2. Submit
    mutate({ name: values.name, visibility: "private" });
  }

  function onReset() {
    // Show toast, redirect and reset state
    toast.info("Discarded your changes");

    // Redirect to categories page
    router.push("/categories");

    // Reset state
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
  useEffect(() => {
    // We check for both to be successful because of rerendering issues
    if (isSuccess && data) {
      // If push changes (save) is successful then we show a toast and redirect to the categories page
      if (data.status === "success") {
        toast.success(data.message);

        // Redirect to categories page
        router.push("/categories");

        // Reset state
        reset();
      } else {
        // If push changes (save) is unsuccessful then we show a toast and we don't redirect
        toast.error(data.message);
      }
    }
  }, [data, isSuccess, reset, router]);

  // Render
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex h-full flex-col gap-8"
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
                  <Input placeholder={`Example Media`} {...field} />
                </FormControl>
                <FormDescription>
                  This is the public display name for the media.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Upload />
                </FormControl>
                <FormDescription>
                  These are the public display media.
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
  discardLoading?: boolean;
  pushChangesLoading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
      <h1>Create Media</h1>

      {/* CRUD Buttons */}
      {/* The props are passed to the top buttons to show loading states */}
      <TopButtons pushChangesLoading={pushChangesLoading} />
    </div>
  );
}

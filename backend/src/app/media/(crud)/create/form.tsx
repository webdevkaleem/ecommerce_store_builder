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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { type CollectionsType } from "@/lib/const";
import { labelToSlug } from "@/lib/helper-functions";
import { useCreateMediaStore } from "@/store/admin/create-media";
import { api } from "@/trpc/react";
import ImageUploader from "./image-uploader";

export const MediaType = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "You must upload an image"),
});

// Body
export default function CreateForm({
  collection,
}: {
  collection: CollectionsType;
}) {
  // State management
  const router = useRouter();
  const formRef = useRef(null);

  const { name, key, resetMedia } = useCreateMediaStore();

  // Derived Functions
  const { mutate, isPending, isSuccess, data, reset } =
    api.media.create.useMutation();

  // Initialize Form
  const form = useForm<z.infer<typeof MediaType>>({
    resolver: zodResolver(MediaType),
    defaultValues: {
      name: "",
      key: "",
    },
  });

  // Helper Functions
  async function onSubmit(values: z.infer<typeof MediaType>) {
    if (MediaType.safeParse({ key, name }).success) {
      return mutate({ name: values.name, keys: [values.key] });
    }

    // Show error states by triggering the form
    await form.trigger("name");
    await form.trigger("key");
  }

  function onReset() {
    // Show toast, redirect and reset state
    toast.info("Discarded your changes");
    resetMedia();

    // Redirect to main page
    router.push(`/${labelToSlug(collection.plural)}`);

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
  // When the state for image name changes, we set the form value to the state
  useEffect(() => {
    if (name) {
      form.setValue("name", labelToSlug(name));
    }

    if (key) {
      form.setValue("key", key);
    }
  }, [name, form, key]);

  useEffect(() => {
    // We check for both to be successful because of rerendering issues
    if (isSuccess && data) {
      // If push changes (save) is successful then we show a toast and redirect to the categories page
      if (data.status === "success") {
        toast.success(data.message);

        // Redirect to main page
        router.push(labelToSlug(collection.plural));

        // Reset state
        reset();
      } else {
        // If push changes (save) is unsuccessful then we show a toast and we don't redirect
        toast.error(data.message);
      }
    }
  }, [collection, data, isSuccess, reset, router]);

  console.log(
    "FORM NAME SUBMIT BOOLEAN",
    MediaType.safeParse({ key, name }).success,
  );

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
            name="key"
            render={() => (
              <FormItem>
                <FormLabel>Media Uploader</FormLabel>
                <FormControl>
                  <ImageUploader
                    isNameSubmittedSuccessfully={
                      MediaType.safeParse({ key, name }).success
                    }
                  />
                </FormControl>
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

// Global Imports
"use client";

import Image from "next/image";

// Local Imports
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { useEffect, useRef, useState } from "react";

import { api } from "@/trpc/react";
import * as motion from "motion/react-client";
import { useCreateMediaStore } from "@/store/admin/create-media";
import { labelToSlug } from "@/lib/helper-functions";

// Body

export default function Upload({
  setFormName,
  setFormImage,
  setFormMediaKey,
}: {
  setFormName: (name: string) => void;
  setFormImage: (image: string) => void;
  setFormMediaKey: (key: string) => void;
}) {
  // State management
  const [showAnimation, setShowAnimation] = useState(false);
  const { images, pushImages, resetMedia } = useCreateMediaStore();

  // Derived Functions
  const { mutate } = api.media.deleteByKey.useMutation();

  // Whenever the imageUrl & imageKey becomes undefined, we set the animation to false
  useEffect(() => {
    if (images.length === 0) {
      setShowAnimation(false);
    }
  }, [images]);

  console.log(images, showAnimation);

  return (
    <div className="flex flex-col gap-4">
      {/* Options & Loader */}
      <div className="flex justify-between">
        <div className="flex w-full items-center gap-4">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // The main image was uploaded successfully
              console.log("RES", res);
              if (res[0]) {
                // Add it to the store
                pushImages(
                  res.map((resImage) => ({
                    key: resImage.key,
                    url: resImage.url,
                  })),
                );

                // Set the values inside the form
                setFormName(res[0].name.split(".")[0] ?? "");
                setFormImage(res[0].url ?? "");
                setFormMediaKey(res[0].key ?? "");
              }
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            // Remove the image which is stored in state if the button is clicked again first
            onBeforeUploadBegin={async (files) => {
              if (images.length > 0 && images[0]) {
                mutate({ key: images[0].key });
                resetMedia();

                // Reset the values inside the form
                setFormName("");
                setFormImage("");
                setFormMediaKey("");
              }

              return files;
            }}
            appearance={{
              button: buttonVariants({ className: "w-full" }),
              container: "w-full",
            }}
            config={{
              mode: "auto",
            }}
          />
        </div>
      </div>

      {/* Images */}

      {images.length > 0 && images[0] && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.25,
          }}
        >
          <div className="flex min-h-full w-full">
            {/* Main */}
            <AspectRatio ratio={1 / 1} className="w-3/5">
              <Image
                src={images[0].url}
                width={1080}
                height={1080}
                className="rounded-md object-cover"
                alt="Demo image"
                onLoadingComplete={() => setShowAnimation(true)}
              />
            </AspectRatio>

            {/* Other */}
            <div className="flex flex-col gap-4">
              {images.map((imageObj) => {
                return (
                  <AspectRatio
                    key={imageObj.key}
                    ratio={1 / 1}
                    className="w-full"
                  >
                    <Image
                      src={imageObj.url}
                      width={400}
                      height={400}
                      className="rounded-md object-cover"
                      alt="Demo image"
                    />
                  </AspectRatio>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

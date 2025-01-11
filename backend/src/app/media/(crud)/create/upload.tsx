// Global Imports
"use client";

// Local Imports
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useCreateMediaStore } from "@/store/admin/create-media";
import { api } from "@/trpc/react";
import * as motion from "motion/react-client";

// Body

export default function Upload({
  setFormName,
}: {
  setFormName: (name: string) => void;
}) {
  // State management
  const [showAnimation, setShowAnimation] = useState(false);
  const { images, pushImages, resetMedia } = useCreateMediaStore();

  // Derived Functions
  const { mutate } = api.media.deleteMany.useMutation();

  // Whenever the imageUrl & imageKey becomes undefined, we set the animation to false
  useEffect(() => {
    if (images.length === 0) {
      setShowAnimation(false);
    }
  }, [images]);

  console.log(images.slice(1));

  return (
    <div className="flex flex-col gap-4">
      {/* Options & Loader */}
      <div className="flex justify-between">
        <div className="flex w-full items-center gap-4">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // The main image was uploaded successfully
              if (res[0]) {
                // Get the server data
                const serverDataArr = res.map(
                  (resImage) => resImage.serverData.images,
                );

                // Add them to the store
                console.log("FROM SERVER", serverDataArr.flat(2));
                pushImages(serverDataArr.flat(2));

                // Set the values inside the form
                setFormName(res[0].name.split(".")[0] ?? "");
              }
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            // Remove the image which is stored in state if the button is clicked again first
            onBeforeUploadBegin={async (files) => {
              if (images.length > 0 && images[0]) {
                // Delete all the images which are stored in state
                mutate({
                  keys: images.map((imageObj) => {
                    return imageObj.key;
                  }),
                });

                // Reset the media state
                resetMedia();

                // Reset the values inside the form
                setFormName("");
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
          <div className="flex min-w-full flex-col gap-4 xl:flex-row">
            {/* Main */}
            <div className="relative w-full xl:w-4/5">
              <AspectRatio ratio={1 / 1} className="w-full">
                <picture>
                  <img
                    src={images[0].url}
                    className="h-full w-full rounded-md object-cover"
                    alt="Demo image"
                    onLoad={() => setShowAnimation(true)}
                  />
                </picture>

                <Badge
                  variant={"secondary"}
                  className="absolute bottom-5 right-5"
                >
                  {images[0].label}
                </Badge>
              </AspectRatio>
            </div>

            {/* Other */}
            <div className="flex:row flex w-full gap-4 xl:w-1/5 xl:flex-col">
              {/* Render all images except the first one (the original) */}
              {images.slice(1).map((imageObj) => {
                return (
                  <div className="relative w-full" key={imageObj.key}>
                    <AspectRatio ratio={1 / 1} className="w-full">
                      <picture>
                        <img
                          src={imageObj.url}
                          width={1080}
                          height={1080}
                          className="rounded-md object-cover"
                          alt="Demo image"
                        />
                      </picture>
                    </AspectRatio>

                    <Badge
                      variant={"secondary"}
                      className="absolute bottom-5 right-5"
                    >
                      {imageObj.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

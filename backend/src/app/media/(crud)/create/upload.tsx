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
import { Badge } from "@/components/ui/badge";

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
                const serverDataArr = res.map((resImage) => {
                  const serverData = resImage.serverData as {
                    uploadedBy: string;
                    images: {
                      key: string;
                      url: string;
                    }[];
                  };

                  return serverData.images;
                });

                // Add them to the store
                console.log("FROM SERVER", serverDataArr.flat(2));
                pushImages(serverDataArr.flat(2));

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
          <div className="flex min-w-full flex-col gap-4 xl:flex-row">
            {/* Main */}
            <div className="relative w-full bg-red-100 xl:w-4/5">
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
                  Original Photo
                </Badge>
              </AspectRatio>
            </div>

            {/* Other */}
            <div className="flex:row flex w-full gap-4 bg-blue-100 xl:w-1/5 xl:flex-col">
              {/* Render all images except the first one (the original) */}
              {images.slice(1).map((imageObj, i) => {
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
                      {i === 0 && "Mobile Photo"}
                      {i === 1 && "Tablet Photo"}
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

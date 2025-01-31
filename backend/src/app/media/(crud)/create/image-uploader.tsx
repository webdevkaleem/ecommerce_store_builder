"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { bytesToSize, labelToSlug } from "@/lib/helper-functions";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useCreateMediaStore } from "@/store/admin/create-media";
import { X } from "lucide-react";
import * as motion from "motion/react-client";
import { useState } from "react";

export default function ImageUploader({
  isNameSubmittedSuccessfully = false,
}: {
  isNameSubmittedSuccessfully?: boolean;
}) {
  const [showAnimation, setShowAnimation] = useState(false);

  const { url, size, extension, resetMedia, setMedia, setName } =
    useCreateMediaStore();

  return (
    <div className="flex flex-col gap-4">
      <UploadDropzone
        appearance={{
          // The styles before the ||||| are the default styles taken from the default button component
          button:
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-12 rounded-md px-10 ||||| w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:text-primary dark:bg-primary-foreground shadow dark:hover:bg-primary-foreground/90 after:bg-secondary ut-ready:bg-primary ut-ready:border-primary ut-uploading:cursor-not-allowed",
          label: "text-primary hover:text-primary/90",
        }}
        endpoint="imageUploader"
        onBeforeUploadBegin={(files) => {
          // Reset the image state before the user upload a new image
          resetMedia();

          return files;
        }}
        onClientUploadComplete={(res) => {
          if (!res[0]) return;

          const mobileImageArr = res[0].serverData.images.map((imageObj) => {
            if (imageObj.type === "mobile") {
              return imageObj;
            }
          });

          mobileImageArr.map((mobileObj) => {
            if (!res[0]) return;

            if (mobileObj) {
              setMedia({
                url: mobileObj.url,
                extension: "png",
                size: bytesToSize(mobileObj.size),
                key: mobileObj.key,
                type: mobileObj.type,
              });
            }
          });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          resetMedia();

          console.log(error);
        }}
        config={{ cn }}
      />

      {/* Loading the skeleton */}
      {url && (
        <motion.div
          className="h-32 w-full"
          initial={{ opacity: 1, display: "block" }}
          animate={
            showAnimation
              ? { display: "none", opacity: 0 }
              : { display: "block", opacity: 1 }
          }
        >
          <Skeleton className="h-32 w-full" />
        </motion.div>
      )}

      {/* Loading the actual image component */}
      {url && (
        <motion.div
          className="flex h-32 flex-row items-center gap-4 rounded-md"
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
        >
          <picture className="relative flex w-full gap-4">
            <img
              src={url}
              className="h-28 w-28 rounded-md object-cover"
              onLoad={() => {
                setShowAnimation(true);
              }}
              alt="currently uploaded image"
            />

            <div
              className="absolute left-1 top-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground"
              onClick={resetMedia}
            >
              <X className="h-3 w-3" />
            </div>

            <div className="flex w-full flex-col justify-between gap-2">
              {/* If the length of the name of the media is 0 and the form isn't submitted successfully then we show destructive styles */}
              <Input
                placeholder={`Media Name`}
                onChange={(e) => setName(labelToSlug(e.target.value))}
                className={cn({
                  "border-destructive placeholder:text-destructive":
                    !isNameSubmittedSuccessfully,
                })}
              />

              <Separator />

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs">Minimum Size:</span>
                  <Badge>{size}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs">Extention:</span>
                  <Badge>{extension}</Badge>
                </div>
              </div>
            </div>
          </picture>
        </motion.div>
      )}
    </div>
  );
}

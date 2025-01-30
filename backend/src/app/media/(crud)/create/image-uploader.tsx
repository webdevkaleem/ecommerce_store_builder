"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import * as motion from "motion/react-client";
import { useState } from "react";

export default function ImageUploader() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  function cleanImageState() {
    setFileUrl(null);
    setFileName(null);

    return;
  }

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
          cleanImageState();

          return files;
        }}
        onClientUploadComplete={(res) => {
          if (!res[0]) return;

          const mobileImageUrl = res[0].serverData.images.map((imageObj) => {
            if (imageObj.type === "mobile") {
              return imageObj.url;
            }
          });

          mobileImageUrl.map((mobileUrl) => {
            if (!res[0]) return;

            if (mobileUrl) {
              setFileUrl(mobileUrl);
              setFileName(res[0].name.split(".")[0] ?? "");
            }
          });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.log(error);
          setFileUrl(null);
        }}
      />

      {/* Loading the skeleton */}
      {fileUrl && (
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
      {fileUrl && (
        <motion.div
          className="flex h-32 w-full items-center gap-6 rounded-md"
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
        >
          <picture className="flex w-full gap-6">
            <img
              src={fileUrl}
              className="h-28 w-28 rounded-md object-cover"
              onLoad={() => {
                setShowAnimation(true);
              }}
              alt="currently uploaded image"
            />

            <div className="flex w-full items-center">
              <Input placeholder={`Name`} defaultValue={fileName ?? ""} />
            </div>
          </picture>

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant={"destructive_outline"} onClick={cleanImageState}>
              <X />
              <span>Delete</span>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

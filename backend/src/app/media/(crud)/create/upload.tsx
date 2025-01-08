// Global Imports
"use client";

import Image from "next/image";

// Local Imports
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { useRef, useState } from "react";

import { api } from "@/trpc/react";
import * as motion from "motion/react-client";

// Body

export default function Upload() {
  // State management
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageKey, setImageKey] = useState<string | undefined>(undefined);
  const ref = useRef(null);

  // Derived Functions
  const { mutate } = api.media.deleteByKey.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {/* Options & Loader */}
      <div className="flex justify-between">
        <div className="flex w-full items-center gap-4">
          <UploadButton
            input={{ name: "Image" }}
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              setImageUrl(res[0]?.url);
              setImageKey(res[0]?.key);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            // Remove the image which is stored in state if the button is clicked again first
            onBeforeUploadBegin={async (files) => {
              if (imageUrl && imageKey) {
                mutate({ key: imageKey });
                setImageUrl(undefined);
                setImageKey(undefined);
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

        <div className=""></div>
      </div>

      {/* Images */}

      {imageUrl && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={ref.current ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.25,
          }}
          ref={ref}
        >
          <div className="flex min-h-full w-full gap-4">
            {/* Main */}
            <div className="w-2/3">
              <AspectRatio ratio={1 / 1} className="w-full">
                <Image
                  src={imageUrl}
                  width={1080}
                  height={1080}
                  className="rounded-md object-cover"
                  alt="Demo image"
                />
              </AspectRatio>
            </div>

            {/* Other */}
            <div className="flex w-1/3 gap-4 transition-all duration-1000">
              <div className="w-full">
                <AspectRatio ratio={1 / 1} className="w-full">
                  <Image
                    src={imageUrl}
                    width={1080}
                    height={1080}
                    className="rounded-md object-cover"
                    alt="Demo image"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

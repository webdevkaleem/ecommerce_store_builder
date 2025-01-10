import { labelToSlug } from "@/lib/helper-functions";
import { utapi } from "@/server/uploadthing";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTFile, UTFiles } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "2MB",
      maxFileCount: 1,
      additionalProperties: {
        aspectRatio: 1,
        height: 1080,
        width: 1080,
      },
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files, input }) => {
      // This code runs on your server before upload
      const user = auth(req);

      // If you throw, the user will not be able to upload
      if (!user) new UploadThingError("UNAUTHORIZED");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      const fileOverrides = files.map((file) => {
        const slugifyName = labelToSlug(file.name);
        return { ...file, name: slugifyName };
      });

      // Return userId to be used in onUploadComplete
      return { userId: user.id, [UTFiles]: fileOverrides };
    })
    .onUploadComplete(async ({ metadata, file, req }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
